<?php
/**
 * Created by PhpStorm.
 * User: MarioSlim
 * Date: 22.01.2019
 * Time: 17:08
 */

namespace App\Form;

use App\Entity\Task;
use App\Entity\TaskAccess;
use App\Entity\User;
use Doctrine\ORM\EntityRepository;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextType;

class OpenAccessType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('task_id', TextType::class, array('label' => false))
            ->add('task_name', EntityType::class, array(
                'mapped'=>false,
                'class' => Task::class,
                'required' => false,
                'label' => false,
                'query_builder' => function (EntityRepository $er) {
                    return $er->createQueryBuilder('task')
                        ->orderBy('task.name', 'ASC');
                },
                'choice_label' => function (Task $task) {
                    return $task->getName() . " End Time: " . $task->getEndTime()->format('Y:m:d H:i:s');
                },
            ))
            ->add('user_id', TextType::class, array('label' => false))
            ->add('user_name', EntityType::class, array(
                'mapped'=>false,
                'class' => User::class,
                'required' => false,
                'label' => false,
                'query_builder' => function (EntityRepository $er) {
                    return $er->createQueryBuilder('user');
                },
                'choice_label' => function (User $user) {
                    return $user->getUsername();
                },
            ));
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => TaskAccess::class,
        ));
    }
}