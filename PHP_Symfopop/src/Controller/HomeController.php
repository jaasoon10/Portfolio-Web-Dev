<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

// Controlador per a la pàgina d'inici
final class HomeController extends AbstractController
{
    #[Route('/', name: 'app_home')]
    public function index(): Response
    {
        // Redirecció directa al catàleg de productes (experiència d'usuari)
        return $this->redirectToRoute('app_product_index');
    }
}
