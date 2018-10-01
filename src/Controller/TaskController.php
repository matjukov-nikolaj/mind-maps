<?php

namespace App\Controller;
use App\Entity\Task;
use App\Form\TaskType;
use App\Model\NodeForDom;
use App\Model\TreeForDom;
use App\Model\TreeForJson;
use App\Model\NodeForJson;
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

    private function getTaskEntity($timestamp, $userId)
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
        $form = $this->createForm(TaskType::class, $task);

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
            $form = $this->createForm(TaskType::class, $task);
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

    /**
     * @Route("/get_task_mind_map_value")
     */

    public function getMindMapTaskValue(Request $request)
    {
        $timestamp = $request->request->get('timestamp');
        $userId = $this->getUser()->getId();
        $taskEntity = $this->getTaskEntity($timestamp, $userId);
        $treeJson = new TreeForJson($taskEntity->getName());
        $treeJson->root = $this->loadNode($taskEntity, true);
        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        $jsonContent =  $serializer->serialize($treeJson, "json");
        return new Response($jsonContent);
    }

    /**
     * @Route("/task/{timestamp}")
     */

    public function mindMapsAction($timestamp, Request $request)
    {
        $userId = $this->getUser()->getId();
        $taskEntity = $this->getTaskEntity($timestamp, $userId);
        $treeDom = new TreeForDom($taskEntity);
        $treeDom->root = $this->loadNode($taskEntity, false);

        $form = $this->formHandler($request);

        return $this->render('task_creator.html.twig',
            array('tree' => $treeDom,
                'form' => $form->createView(),)
        );
    }

}