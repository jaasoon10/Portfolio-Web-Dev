<?php

namespace App\Form;

use App\Entity\Product;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\UrlType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\MoneyType;
use Symfony\Component\Validator\Constraints as Assert;

// Definició del formulari per a l'entitat Product
class ProductType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            // Títol del producte amb validacions (ús d'arguments concrets de PHP 8 per evitar warnings)
            ->add('title', TextType::class, [
                'constraints' => [
                    new Assert\NotBlank(
                        message: 'El títol no pot estar buit'
                    ),
                    new Assert\Length(
                        min: 3,
                        max: 255,
                        minMessage: 'El títol ha de tenir almenys {{ limit }} caràcters'
                    )
                ]
            ])
            // Descripció detallada del producte
            ->add('description', null, [
                'constraints' => [
                    new Assert\NotBlank(
                        message: 'La descripció és obligatòria'
                    ),
                    new Assert\Length(min: 10)
                ]
            ])
            // Preu del producte en euros
            ->add('price', MoneyType::class, [
                'currency' => 'EUR',
                'invalid_message' => 'Introdueix un preu vàlid',
                'constraints' => [
                    new Assert\NotBlank(),
                    new Assert\Positive(
                        message: 'El preu ha de ser positiu'
                    )
                ]
            ])
            // URL opcional de la imatge del producte
            ->add('image', UrlType::class, [
                'required' => false,
                'help' => 'Deixa-ho en blanc per utilitzar una imatge aleatòria',
                'constraints' => [
                    new Assert\Url(
                        message: 'Has d\'introduir una URL vàlida'
                    )
                ]
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Product::class,
        ]);
    }
}
