<?php

namespace App\Repository;

use App\Entity\Task;
use App\Entity\TaskAccess;
use App\Entity\User;
use Doctrine\ORM\Query\ResultSetMapping;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method TaskAccess|null find($id, $lockMode = null, $lockVersion = null)
 * @method TaskAccess|null findOneBy(array $criteria, array $orderBy = null)
 * @method TaskAccess[]    findAll()
 * @method TaskAccess[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TaskAccessRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, TaskAccess::class);
    }

    public function findByUserId($user_id): array {
        $conn = $this->getEntityManager()->getConnection();

        $sql = 'SELECT
                  ta.id AS task_access_id,
                  u.id AS user_id,
                  u.username AS username,
                  t.id AS task_id,
                  t.name AS task_name
                FROM
                  user u
                INNER JOIN task_access ta ON ta.user_id = u.id
                INNER JOIN task t ON t.id = ta.task_id
                WHERE
                  t.user_id = :user_id';
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':user_id', $user_id);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function findTaskAccessByUserId($user_id): array {
        $conn = $this->getEntityManager()->getConnection();

        $sql = 'SELECT
                  u.id AS user_id, 
                  u.username AS username, 
                  t.id AS task_id, 
                  t.name AS task_name, 
                  t.description AS task_description, 
                  t.end_time AS task_end, 
                  t.complete AS task_complete,
                  u2.id AS autor_id, 
                  u2.username AS autor_username
                FROM
                  user u
                INNER JOIN task_access ta ON ta.user_id = u.id
                INNER JOIN task t ON t.id = ta.task_id
                INNER JOIN user u2 ON u2.id = t.user_id
                WHERE
                  u.id = :user_id';
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':user_id', $user_id);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function findComments($user_id): array {
        $conn = $this->getEntityManager()->getConnection();

        $sql = 'SELECT 
                  u.id AS user_id, 
                  u.username AS username, 
                  t.id AS task_id, 
                  c.id AS comment_id, 
                  c.value AS comment_value,
                  c.date AS comment_date 
                FROM 
                  user u 
                INNER JOIN task_access ta ON ta.user_id = u.id 
                INNER JOIN task t ON t.id = ta.task_id
                INNER JOIN comment c ON c.user_id = u.id AND t.id = c.task_id
                WHERE 
                  t.id IN (
                            SELECT t2.id
                            FROM 
                              user u2
                            INNER JOIN task_access ta2 ON ta2.user_id = u2.id
                            INNER JOIN task t2 ON t2.id = ta2.task_id
                            WHERE
                              u2.id = :user_id
                          )
                ORDER BY c.date ASC';
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':user_id', $user_id);
        $stmt->execute();
        return $stmt->fetchAll();
    }

//    /**
//     * @return TaskAccess[] Returns an array of TaskAccess objects
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
    public function findOneBySomeField($value): ?TaskAccess
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
