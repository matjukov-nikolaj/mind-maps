<?php

namespace App\Repository;

use App\Entity\MindMap;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method MindMap|null find($id, $lockMode = null, $lockVersion = null)
 * @method MindMap|null findOneBy(array $criteria, array $orderBy = null)
 * @method MindMap[]    findAll()
 * @method MindMap[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MindMapRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, MindMap::class);
    }

}
