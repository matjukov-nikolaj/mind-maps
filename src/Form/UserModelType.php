<?php
namespace App\Form;

use App\Entity\User;
use App\Model\UserModel;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\FileType;

class UserModelType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('firstName', TextType::class, array('label' => false))
            ->add('lastName', TextType::class, array('label' => false))
            ->add('middleName', TextType::class, array('label' => false))
            ->add('photo', FileType::class, array('label' => false))
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => UserModel::class,
        ));
    }
}
