<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

// Controlador per gestionar l'autenticació (login i logout)
class SecurityController extends AbstractController
{
    #[Route(path: '/login', name: 'app_login')]
    public function login(AuthenticationUtils $authenticationUtils): Response
    {
        // Si l'usuari ja està loguejat, no cal que vegi la pàgina de login
        if ($this->getUser()) {
            return $this->redirectToRoute('app_product_index');
        }

        // Recupera l'error de login si n'hi ha hagut un
        $error = $authenticationUtils->getLastAuthenticationError();
        // Recupera l'últim nom d'usuari introduït
        $lastUsername = $authenticationUtils->getLastUsername();

        return $this->render('security/login.html.twig', ['last_username' => $lastUsername, 'error' => $error]);
    }

    // Ruta de logout: Symfony intercepta aquesta crida automàticament
    #[Route(path: '/logout', name: 'app_logout')]
    public function logout(): void
    {
        throw new \LogicException('Mètode buit: serà interceptat per la clau logout del firewall.');
    }
}
