<?php

namespace App\Repository;

use App\Entity\TagTask;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method TagTask|null find($id, $lockMode = null, $lockVersion = null)
 * @method TagTask|null findOneBy(array $criteria, array $orderBy = null)
 * @method TagTask[]    findAll()
 * @method TagTask[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TagTaskRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, TagTask::class);
    }

    public function removeTagTask($task_id, $tag_id): void {
        $conn = $this->getEntityManager()->getConnection();
        $sql = 'DELETE
                FROM
                  tag_task
                WHERE
                  task_id = :task_id 
                AND 
                  tag_id = :tag_id';
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':task_id', $task_id);
        $stmt->bindValue(':tag_id', $tag_id);
        $stmt->execute();
    }

    public function removeTagTaskByTag($tag_id): void {
        $conn = $this->getEntityManager()->getConnection();
        $sql = 'DELETE
                FROM
                  tag_task
                WHERE
                  tag_id = :tag_id';
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':tag_id', $tag_id);
        $stmt->execute();
    }

    public function findTagTask($task_id): array {
        $conn = $this->getEntityManager()->getConnection();
        $sql = 'SELECT 
                  tag_id 
                FROM 
                  tag_task 
                WHERE 
                  task_id = :task_id';
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':task_id', $task_id);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function isExistsByTagIdAndTaskId($tagId, $taskId): bool {
        $conn = $this->getEntityManager()->getConnection();

        $sql = '
            SELECT
              *
            FROM
              tag_task
            WHERE
              tag_id = :tag_id
              AND task_id = :task_id
        ';
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':tag_id', $tagId);
        $stmt->bindValue(':task_id', $taskId);
        $stmt->execute();
        return (COUNT($stmt->fetchAll()) != 0);
    }

    public function deleteTaskFromTagTask($taskId)
    {
        $query = '
          DELETE
          FROM
            tag_task
          WHERE
            task_id = :task_id
        ';
        ;
        $conn = $this->getEntityManager()->getConnection();
        $stmt = $conn->prepare($query);
        $stmt->bindValue(':task_id', $taskId);
        $stmt->execute();
    }

//    /**
//     * @return TagTask[] Returns an array of TagTask objects
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
    public function findOneBySomeField($value): ?TagTask
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
