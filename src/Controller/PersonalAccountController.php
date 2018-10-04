<?php

namespace App\Controller;

use App\Entity\MindMap;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Task;
use App\Form\CreateTaskType;

class PersonalAccountController extends Controller
{

    private function getMindMapEntity($userId)
    {
        $mindMap = $this->getDoctrine()
            ->getRepository(MindMap::class)
            ->findBy(
                array('user_id' => $userId)
            );

        return $mindMap;
    }

    private function getTaskEntity($userId)
    {
        $task = $this->getDoctrine()
            ->getRepository(Task::class)
            ->findBy(
                array('user_id' => $userId)
            );

        return $task;
    }

    private function getNameOfRoot($value)
    {
        $jsonObj = json_decode($value);
        $rootObj = $jsonObj->{'root'};
        $rootName = $rootObj->{'title'};
        return $rootName;
    }

    private function getUserMindMapsInfo()
    {
        $userId = $this->getUser()->getId();
        $mindMapEntity = $this->getMindMapEntity($userId);

        $mindMapNames = array();
        $mindMapRoots = array();
        for ($i = 0; $i < COUNT($mindMapEntity); ++$i) {
            /** @var MindMap $currMindMap */
            $currMindMap = $mindMapEntity[$i];
            array_push($mindMapNames, $currMindMap->getName());
            $rootName = $this->getNameOfRoot($currMindMap->getValue());
            array_push($mindMapRoots, $rootName);
        }
        return array(
            'names' => $mindMapNames,
            'rootNames' => $mindMapRoots,
        );
    }

    private function getUserTasksInfo()
    {
        $userId = $this->getUser()->getId();
        $taskEntity = $this->getTaskEntity($userId);

        $taskNames = array();
        $taskDescriptions = array();
        $timestamps = array();
        for ($i = 0; $i < COUNT($taskEntity); ++$i) {
            /** @var Task $currTask */
            $currTask = $taskEntity[$i];
            array_push($taskNames, $currTask->getName());
            array_push($taskDescriptions, $currTask->getDescription());
            array_push($timestamps, $currTask->getStartTime());
        }
        return array(
            'names' => $taskNames,
            'descriptions' => $taskDescriptions,
            'timestamps' => $timestamps
        );
    }

    private function processSavingTaskEntity(Task $task)
    {
        $currentTime = new \DateTime();
        $task->setStartTime($currentTime->getTimestamp());
        $entityManager = $this->getDoctrine()->getManager();
        $userId = $this->getUser()->getId();
        $task->setUserId($userId);
        $entityManager->persist($task);
        $entityManager->flush();
    }

    /**
     * @Route("/personal")
     */

    public function personalAccountAction(Request $request)
    {
        $mindMapInfo = $this->getUserMindMapsInfo();
        $names = $mindMapInfo['names'];
        $rootNames = $mindMapInfo['rootNames'];

        $taskInfo = $this->getUserTasksInfo();
        $taskNames = $taskInfo['names'];
        $taskDescriptions = $taskInfo['descriptions'];
        $timestamps = $taskInfo['timestamps'];

        $task = new Task();
        $form = $this->createForm(CreateTaskType::class, $task);

        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            /** @var Task $taskEntity */
            $taskEntity = $form['parent']->getData();
            if ($taskEntity != null) {
                $task->setParent($taskEntity->getId());
            }
            $this->processSavingTaskEntity($task);
            unset($entity);
            unset($form);
            $task = new Task();
            $form = $this->createForm(CreateTaskType::class, $task);
            return $this->redirect($request->getUri());
        }

        return $this->render(
            'personal_account.html.twig',
            array(
                'username' => $this->getUser()->getUsername(),
                'mindMapNames' => $names,
                'mindMapRootNames' => $rootNames,
                'taskNames' => $taskNames,
                'taskDescriptions' => $taskDescriptions,
                'timestamps' => $timestamps,
                'formCreateTask' => $form->createView(),
            )
        );
    }

}