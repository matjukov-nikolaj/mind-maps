<?php
/**
 * Created by PhpStorm.
 * User: MarioSlim
 * Date: 22.01.2019
 * Time: 17:08
 */

namespace App\Form;

use App\Model\DateInterval;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class StatisticForm extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('from', DateTimeType::class, array('label' => false))
            ->add('to', DateTimeType::class, array('label' => false))
            ->add('success', CheckboxType ::class, array('label' => false))
            ->add('failed', CheckboxType ::class, array('label' => false))
            ->add('progress', CheckboxType ::class, array('label' => false))
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => DateInterval::class,
        ));
    }
}