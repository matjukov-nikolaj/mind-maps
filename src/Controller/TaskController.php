<?php

namespace App\Controller;
use App\Entity\Task;
use App\Form\CreateTaskType;
use App\Form\UpdateTaskType;
use App\Model\NodeForDom;
use App\Model\TreeForDom;
use App\Model\TreeForJson;
use App\Model\NodeForJson;
use DateTime;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;


class TaskController extends Controller
{

    private function getTaskEntityByTimeStampAndUserId($timestamp, $userId)
    {
        $task = $this->getDoctrine()
            ->getRepository(Task::class)
            ->findOneBy(
                array(
                    'start_time' => $timestamp,
                    'user_id' => $userId
                )
            );

        return $task;
    }

    private function getTaskEntityByIdAndUserId($id, $userId)
    {
        $task = $this->getDoctrine()
            ->getRepository(Task::class)
            ->findOneBy(
                array(
                    'id' => $id,
                    'user_id' => $userId
                )
            );

        return $task;
    }

    private function getChildrenTask($taskEntity) {
        /** @var Task $taskEntity */
        $children = $this->getDoctrine()
            ->getRepository(Task::class)
            ->findBy(
                array(
                    'parent' => $taskEntity->getId(),
                    'user_id' => $taskEntity->getUserId()
                )
            );
        return $children;
    }

    private function getTaskNameWithEndDate($taskEntity) {
        /** @var Task $taskEntity */
        return $taskEntity->getName() . $taskEntity->getEndTime()->format(' Y:m:d H:i:s');
    }


    private function loadNode($taskEntity, $isJson) {
        /** @var Task $taskEntity */
        $node = $isJson ? new NodeForJson($taskEntity->getName()) : new NodeForDom($taskEntity) ;
        $children = $this->getChildrenTask($taskEntity);
        /** @var Task $child */
        for ($i = 0; $i < COUNT($children); ++$i) {
            $child = $children[$i];
            $childNode = $isJson ? $this->loadNode($child, true) : $this->loadNode($child, false);
            $node->appendChild($childNode);
        }
        return $node;
    }

    private function setJsonTree($treeJson) {
        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        $jsonContent =  $serializer->serialize($treeJson, "json");
        $this->jsonTree = $jsonContent;
    }

    private function formHandler(Request $request) {
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
        }
        return $form;
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

    private function processUpdatingTaskEntity(Task $task)
    {
        $userId = $this->getUser()->getId();
        /** @var Task $taskEntity */
//        $taskEntity = $this->getTaskEntityByIdAndUserId()
        $currentTime = new \DateTime();
        $task->setStartTime($currentTime->getTimestamp());
        $entityManager = $this->getDoctrine()->getManager();
        $userId = $this->getUser()->getId();
        $task->setUserId($userId);
        $entityManager->persist($task);
        $entityManager->flush();
    }


    /**
     * @Route("/get_task_mind_map_value")
     */

    public function getMindMapTaskValue(Request $request)
    {
        $timestamp = $request->request->get('timestamp');
        $userId = $this->getUser()->getId();
        $taskEntity = $this->getTaskEntityByTimeStampAndUserId($timestamp, $userId);
        $treeJson = new TreeForJson($taskEntity->getName());
        $treeJson->root = $this->loadNode($taskEntity, true);
        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        $jsonContent =  $serializer->serialize($treeJson, "json");
        return new Response($jsonContent);
    }

    /**
     * @Route("/update_task")
     */
    public function updateCurrentClickedTask(Request $request) {
        $id = $request->request->get('id');
        $userId = $this->getUser()->getId();
        /** @var Task $task */
        $task = $this->getTaskEntityByIdAndUserId($id, $userId);
        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        $jsonContent =  $serializer->serialize($task, "json");
        return new Response($jsonContent);
    }

    /**
     * @Route("/task/{timestamp}")
     */

    public function mindMapsAction($timestamp, Request $request)
    {
        $userId = $this->getUser()->getId();
        $taskEntity = $this->getTaskEntityByTimeStampAndUserId($timestamp, $userId);
        $treeDom = new TreeForDom($taskEntity);
        $treeDom->root = $this->loadNode($taskEntity, false);

        $task = new Task();
        $formCreateTask = $this->createForm(CreateTaskType::class, $task);

        $formCreateTask->handleRequest($request);
        if ($formCreateTask->isSubmitted() && $formCreateTask->isValid()) {
            /** @var Task $taskEntity */
            $taskEntity = $formCreateTask['parent']->getData();
            if ($taskEntity != null) {
                $task->setParent($taskEntity->getId());
            }
            $this->processSavingTaskEntity($task);
            unset($entity);
            unset($formCreateTask);
            $task = new Task();
            $formCreateTask = $this->createForm(CreateTaskType::class, $task);
            return $this->redirect($request->getUri());
        }

        $taskUpdate = new Task();
        $formUpdateTask = $this->createForm(UpdateTaskType::class, $taskUpdate);

        $formUpdateTask->handleRequest($request);
        if ($formUpdateTask->isSubmitted() && $formUpdateTask->isValid()) {
            /** @var Task $taskUpdateEntity */
            $taskUpdateEntity = $formUpdateTask['parent']->getData();
            if ($taskUpdateEntity != null) {
                $taskUpdate->setParent($taskUpdateEntity->getId());
            }
//            $this->processUpdatingTaskEntity($taskUpdate);
            unset($taskUpdate);
            unset($formUpdateTask);
            $taskUpdate = new Task();
            $formUpdateTask = $this->createForm(UpdateTaskType::class, $taskUpdate);
            return $this->redirect($request->getUri());
        }

        return $this->render('task_creator.html.twig',
            array('tree' => $treeDom,
                'formCreateTask' => $formCreateTask->createView(),
                'formUpdateTask' => $formUpdateTask->createView(),
                )
        );
    }

}