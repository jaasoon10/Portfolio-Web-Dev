<?php

namespace App\Controller;

use App\Entity\Product;
use App\Form\ProductType;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;

// Controlador per gestionar totes les operacions dels productes (CRUD)
#[Route('/product')]
class ProductController extends AbstractController
{
    // Llistat principal de productes amb buscador
    #[Route('', name: 'app_product_index', methods: ['GET'])]
    public function index(Request $request, ProductRepository $productRepository): Response
    {
        $searchTerm = $request->query->get('q'); // Recupera el terme de cerca de la URL

        return $this->render('product/index.html.twig', [
            'products' => $productRepository->findBySearch($searchTerm),
            'search_term' => $searchTerm
        ]);
    }

    // Llistat exclusiu dels productes de l'usuari autenticat
    #[Route('/my/products', name: 'app_my_products')]
    #[IsGranted('ROLE_USER')]
    public function myProducts(ProductRepository $productRepository): Response
    {
        return $this->render('product/index.html.twig', [
            'products' => $productRepository->findBy(['owner' => $this->getUser()], ['createdAt' => 'DESC']),
            'is_my_list' => true
        ]);
    }

    // Crear un nou producte
    #[Route('/new', name: 'app_product_new', methods: ['GET', 'POST'])]
    #[IsGranted('ROLE_USER')]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $product = new Product();
        $form = $this->createForm(ProductType::class, $product);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $product->setOwner($this->getUser()); // Assigna l'usuari actual com a propietari
            $product->setCreatedAt(new \DateTimeImmutable()); // Data de creació

            if (!$product->getImage()) {
                // Imatge per defecte si no n'hi ha cap
                $product->setImage('https://picsum.photos/seed/' . rand(1, 999) . '/400/300');
            }

            $entityManager->persist($product);
            $entityManager->flush();

            $this->addFlash('success', 'Producte publicat amb èxit!');
            return $this->redirectToRoute('app_product_show', ['slug' => $product->getSlug()]);
        }

        return $this->render('product/new.html.twig', [
            'product' => $product,
            'form' => $form,
        ]);
    }

    // Mostrar el detall d'un producte utilitzant el slug per a SEO
    #[Route('/show/{slug}', name: 'app_product_show', methods: ['GET'])]
    public function show(
        #[MapEntity(mapping: ['slug' => 'slug'])] Product $product
    ): Response {
        return $this->render('product/show.html.twig', [
            'product' => $product,
        ]);
    }

    // Editar un producte existent (només el propietari)
    #[Route('/{slug}/edit', name: 'app_product_edit', methods: ['GET', 'POST'])]
    #[IsGranted('ROLE_USER')]
    public function edit(
        Request $request,
        #[MapEntity(mapping: ['slug' => 'slug'])] Product $product,
        EntityManagerInterface $entityManager
    ): Response {
        // Comprovació de seguretat: només el propietari pot editar
        if ($product->getOwner() !== $this->getUser()) {
            throw $this->createAccessDeniedException('No tens permís per editar aquest producte.');
        }

        $form = $this->createForm(ProductType::class, $product);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            // Forcem la regeneració del slug si el títol ha canviat
            $product->setSlug('-');
            $entityManager->flush();
            $this->addFlash('info', 'Producte actualitzat.');
            return $this->redirectToRoute('app_product_show', ['slug' => $product->getSlug()]);
        }

        return $this->render('product/edit.html.twig', [
            'product' => $product,
            'form' => $form,
        ]);
    }

    // Eliminar un producte (només el propietari)
    #[Route('/delete/{id}', name: 'app_product_delete', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function delete(Request $request, Product $product, EntityManagerInterface $entityManager): Response
    {
        // Comprovació de seguretat
        if ($product->getOwner() !== $this->getUser()) {
            throw $this->createAccessDeniedException('No tens permís per eliminar aquest producte.');
        }

        // Validació del token CSRF per seguretat
        if ($this->isCsrfTokenValid('delete' . $product->getId(), $request->request->get('_token'))) {
            $entityManager->remove($product);
            $entityManager->flush();
            $this->addFlash('danger', 'Producte eliminat.');
        }

        return $this->redirectToRoute('app_product_index');
    }
}
