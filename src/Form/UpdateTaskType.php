<?php
namespace App\Form;

use App\Entity\Task;
use Doctrine\ORM\EntityRepository;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Validator\Tests\Fixtures\ToString;

class UpdateTaskType extends AbstractType
{

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name', TextType::class, array('label' => false))
            ->add('description', TextareaType::class, array('label' => false))
            ->add('end_time', DateTimeType::class, array('label' => false))
            ->add('parent', EntityType::class, array(
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
            ));
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => Task::class,
        ));
    }
}