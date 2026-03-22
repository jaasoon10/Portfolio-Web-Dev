<?php

namespace App\DataFixtures;

use App\Entity\User;
use App\Entity\Product;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

// Carrega dades de prova inicials
class AppFixtures extends Fixture
{
    private UserPasswordHasherInterface $passwordHasher;

    // Injectem l'encoder de contrasenyes per seguretat
    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager): void
    {
        // Generador de dades realistes faker en espanyol
        $faker = Factory::create('es_ES');
        $users = [];

        // Administrador base (admin123)
        $admin = new User();
        $admin->setEmail('admin@symfopop.com');
        $admin->setName('Administrador');
        $admin->setRoles(['ROLE_USER']);
        $admin->setPassword($this->passwordHasher->hashPassword($admin, 'admin123'));
        $manager->persist($admin);
        $users[] = $admin;

        // Crea 4 usuaris aleatoris més
        for ($i = 0; $i < 4; $i++) {
            $user = new User();
            $user->setEmail($faker->email);
            $user->setName($faker->name);
            $user->setRoles(['ROLE_USER']);
            $user->setPassword($this->passwordHasher->hashPassword($user, 'password123'));
            $manager->persist($user);
            $users[] = $user;
        }

        // Generació de 20 productes per a proves
        for ($i = 0; $i < 20; $i++) {
            $product = new Product();
            $product->setTitle($faker->sentence(3));
            $product->setDescription($faker->paragraph);
            $product->setPrice($faker->randomFloat(2, 10, 500));
            // Imatge amb seed aleatòria de picsum
            $product->setImage('https://picsum.photos/seed/' . rand(1, 999) . '/400/300');
            $product->setCreatedAt(new \DateTimeImmutable());
            // Assignació a un propietari a l'atzar
            $product->setOwner($users[array_rand($users)]);
            $manager->persist($product);
        }

        // Persisteix tots els canvis a la BD d'un sol cop
        $manager->flush();
    }
}
