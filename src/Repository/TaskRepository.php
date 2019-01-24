<?php

namespace App\Repository;

use App\Entity\Task;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method Task|null find($id, $lockMode = null, $lockVersion = null)
 * @method Task|null findOneBy(array $criteria, array $orderBy = null)
 * @method Task[]    findAll()
 * @method Task[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TaskRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Task::class);
    }

    public function getTaskIdByUserIdAndStartTime($userId, $startTime): array
    {
        $query = '
            SELECT
              *
             FROM
               task
            WHERE
               user_id = :user_id
               AND start_time = :start_time
        ';

        $conn = $this->getEntityManager()->getConnection();
        $stmt = $conn->prepare($query);
        $stmt->bindValue(':user_id', $userId);
        $stmt->bindValue(':start_time', $startTime);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function getStatistics($startDate, $endDate)
    {
        $query = "
          SELECT
            CASE complete
              WHEN 0 THEN 'In progress'
	          WHEN 1 THEN 'Success'
	          WHEN -1 THEN 'Failed'
	          ELSE 'Unknown'
            END AS complete_name,
           COUNT(id) AS count_task,
           GROUP_CONCAT(name SEPARATOR ',') AS task_name
          FROM
            task 
          WHERE
            start_time BETWEEN :start_date AND :end_date
          GROUP BY complete
        ";
        $conn = $this->getEntityManager()->getConnection();
        $stmt = $conn->prepare($query);
        $stmt->bindValue(':start_date', $startDate);
        $stmt->bindValue(':end_date', $endDate);
        $stmt->execute();

        return $stmt->fetchAll();
    }

    public function deleteTaskFromComment($task_id): void {
        $conn = $this->getEntityManager()->getConnection();
        $sql = 'DELETE
                FROM
                  comment
                WHERE
                  task_id = :task_id';
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':task_id', $task_id);
        $stmt->execute();
    }

//    /**
//     * @return Task[] Returns an array of Task objects
//     */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('t.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Task
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
