<?php

namespace App\Repository;

use App\Entity\Product;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * Repositori de l'entitat Product per fer consultes personalitzades a la BD
 * @extends ServiceEntityRepository<Product>
 */
class ProductRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Product::class);
    }

    /**
     * Cerca productes pel títol o la descripció
     */
    public function findBySearch(?string $term): array
    {
        $qb = $this->createQueryBuilder('p');

        if ($term) {
            $qb->andWhere('p.title LIKE :term OR p.description LIKE :term')
                ->setParameter('term', '%' . $term . '%');
        }

        return $qb->orderBy('p.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Recupera un producte pel seu slug (URL amigable)
     */
    public function findOneBySlug(string $slug): ?Product
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.slug = :slug')
            ->setParameter('slug', $slug)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
