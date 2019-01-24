<?php

namespace App\Controller;

use App\Entity\Comment;
use App\Entity\Tag;
use App\Entity\TagTask;
use App\Entity\Task;
use App\Entity\TaskAccess;
use App\Form\CreateTaskType;
use App\Form\StatisticForm;
use App\Form\UpdateTaskType;
use App\Model\DateInterval;
use App\Model\NodeForDom;
use App\Model\TreeForDom;
use App\Model\TreeForJson;
use App\Model\NodeForJson;
use DateTime;
use phpDocumentor\Reflection\Types\Integer;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Routing\RouteCollectionBuilder;
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

    private function getChildrenTask($taskEntity)
    {
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

    private function getTaskNameWithEndDate($taskEntity)
    {
        /** @var Task $taskEntity */
        return $taskEntity->getName() . $taskEntity->getEndTime()->format(' Y:m:d H:i:s');
    }


    private function loadNode($taskEntity, $isJson)
    {
        /** @var Task $taskEntity */
        $node = $isJson ? new NodeForJson($taskEntity->getName()) : new NodeForDom($taskEntity);
        $children = $this->getChildrenTask($taskEntity);
        /** @var Task $child */
        for ($i = 0; $i < COUNT($children); ++$i) {
            $child = $children[$i];
            $childNode = $isJson ? $this->loadNode($child, true) : $this->loadNode($child, false);
            $node->appendChild($childNode);
        }
        return $node;
    }

    private function setJsonTree($treeJson)
    {
        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        $jsonContent = $serializer->serialize($treeJson, "json");
        $this->jsonTree = $jsonContent;
    }

    private function formHandler(Request $request)
    {
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
        $currentTime->setTimezone(new \DateTimeZone('Europe/Moscow'));
        $task->setStartTime($currentTime->getTimestamp());
        $userId = $this->getUser()->getId();
        $task->setUserId($userId);
        $task->setComplete(0);
        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->persist($task);
        $entityManager->flush();
    }

    private function processUpdatingTaskEntity(Task $task)
    {
        $userId = $this->getUser()->getId();
        /** @var Task $taskEntity */
        $taskEntity = $this->getTaskEntityByIdAndUserId($task->getId(), $userId);
        $currentTime = new \DateTime();
        $currentTime->setTimezone(new \DateTimeZone('Europe/Moscow'));
        $taskEntity->setName($task->getName());
        $taskEntity->setDescription($task->getDescription());
        $taskEntity->setEndTime($task->getEndTime());
        $taskEntity->setStartTime($currentTime->getTimestamp());
        $taskEntity->setComplete(0);
        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->persist($taskEntity);
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
        $jsonContent = $serializer->serialize($treeJson, "json");
        return new Response($jsonContent);
    }

    /**
     * @Route("/add_tag")
     */
    public function addTag(Request $request)
    {
        $taskId = (int) $request->request->get('task_id');
        $tagId = (int) $request->request->get('tag_id');
        if (!$this->get('doctrine.orm.default_entity_manager')
            ->getRepository(TagTask::class)->isExistsByTagIdAndTaskId($tagId, $taskId)) {
            $tagTask = new TagTask();
            $tagTask->setTaskId($taskId);
            $tagTask->setTagId($tagId);
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($tagTask);
            $entityManager->flush();
        }
        return new Response();
    }

    /**
     * @Route("/remove_tag")
     */
    public function removeTag(Request $request)
    {
        $taskId = (int) $request->request->get('task_id');
        $tagId = (int) $request->request->get('tag_id');
        var_dump(1);
        $this->get('doctrine.orm.default_entity_manager')
            ->getRepository(TagTask::class)
            ->removeTagTask($taskId, $tagId);
        return new Response();
    }

    /**
     * @Route("/get_statistic")
     */
    public function getStatistic(Request $request)
    {
        $from = (string) $request->request->get('from');
        $to = (string) $request->request->get('to');
        $success = (string) $request->request->get('success');
        $failed = (string) $request->request->get('failed');
        $progress = (string) $request->request->get('progress');

        $tempResult = $this->get('doctrine.orm.default_entity_manager')
            ->getRepository(Task::class)
            ->getStatistics($from, $to);

        $result = array();
        foreach ($tempResult as $item) {
            if ($item["complete_name"] == "Failed" && $failed == "true") {
                array_push($result, $item);
            } elseif ($item["complete_name"] == "In progress" && $progress == "true") {
                array_push($result, $item);
            } elseif ($item["complete_name"] == "Success" && $success == "true") {
                array_push($result, $item);
            }
        }

        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        $jsonContent = $serializer->serialize($result, "json");
        return new Response($jsonContent);
    }

    /**
     * @Route("/update_task")
     */
    public function updateCurrentClickedTask(Request $request)
    {
        $id = $request->request->get('id');
        $userId = $this->getUser()->getId();
        /** @var Task $task */
        $task = $this->getTaskEntityByIdAndUserId($id, $userId);
        $result = array();
        $result["entity"] = $task;
        $result["tags"] = $this->get('doctrine.orm.default_entity_manager')
            ->getRepository(TagTask::class)
            ->findTagTask($id);
        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        $jsonContent = $serializer->serialize($result, "json");
        return new Response($jsonContent);
    }

    /**
     * @Route("/close_task")
     */
    public function closeTask(Request $request)
    {
        $id = $request->request->get('id');
        $userId = $this->getUser()->getId();
        /** @var Task $task */
        $task = $this->getTaskEntityByIdAndUserId($id, $userId);
        $currentTime = new DateTime();
        $currentTime->setTimezone(new \DateTimeZone('Europe/Moscow'));
        $task->setCompletionTime($currentTime);
        if ($task->getEndTime()->getTimestamp() <= $currentTime->getTimestamp()) {
            $task->setComplete(-1);
        } else {
            $task->setComplete(1);
        }
        var_dump($task->getComplete());
        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->persist($task);
        $entityManager->flush();
        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        $jsonContent = $serializer->serialize($task, "json");
        return new Response($jsonContent);
    }

    private function getExistingTags($user_id)
    {
        $tag = $this->get('doctrine.orm.default_entity_manager')
            ->getRepository(Tag::class)
            ->findByUserId($user_id);

        return $tag;
    }

    private function deleteChildren(NodeForDom $node) {
        $entityManager = $this->getDoctrine()->getManager();
        $task = $entityManager->getRepository(Task::class)->find($node->id);
        $entityManager->remove($task);
        $entityManager->flush();
        var_dump($node->id);
        $this->get('doctrine.orm.default_entity_manager')->getRepository(TaskAccess::class)->deleteTaskFromTaskAccess($node->id);
        $this->get('doctrine.orm.default_entity_manager')->getRepository(TaskAccess::class)->deleteTaskFromComment($node->id);
        if (COUNT($node->children) != 0) {
            foreach ($node->children as $child) {
                $this->deleteChildren($child);
            }
        }
    }

    /**
     * @Route("/delete_task")
     */
    public function deleteTask(Request $request) {
        $id = $request->request->get('id');
        $userId = $this->getUser()->getId();
        /** @var Task $task */
        $task = $this->getTaskEntityByIdAndUserId($id, $userId);
        if ($task == null) {
            return new Response();
        }
        $treeDom = new TreeForDom($task);
        $treeDom->root = $this->loadNode($task, false);
        $entityManager = $this->getDoctrine()->getManager();
        $taskId = (int) $task->getId();
        $taskParent = (int) $task->getParent();
        $taskEntity = $entityManager->getRepository(Task::class)->find($task->getId());
        $entityManager->remove($taskEntity);
        $entityManager->flush();
        $this->get('doctrine.orm.default_entity_manager')->getRepository(TaskAccess::class)->deleteTaskFromTaskAccess($taskId);
        $this->get('doctrine.orm.default_entity_manager')->getRepository(TaskAccess::class)->deleteTaskFromComment($taskId);
        foreach ($treeDom->root->children as $child) {
            $this->deleteChildren($child);
        }
        if ($taskParent == null) {
            $url = $this->generateUrl("personal");
            return new RedirectResponse($url, 302, []);
        }
        return new Response();
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
        $tags = $this->getExistingTags($this->getUser()->getId());

        $task = new Task();
        $GLOBALS['currentUserId'] = $this->getUser()->getId();
        $formCreateTask = $this->createForm(CreateTaskType::class, $task);

        $taskUpdate = new Task();
        $formUpdateTask = $this->createForm(UpdateTaskType::class, $taskUpdate);

        $dateInterval = new DateInterval();
        $formInterval = $this->createForm(StatisticForm::class, $dateInterval);

        $formCreateTask->handleRequest($request);
        $formUpdateTask->handleRequest($request);

        if ($request->isMethod('POST')) {
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
            } elseif ($formUpdateTask->isSubmitted() && $formUpdateTask->isValid()) {
                    $this->processUpdatingTaskEntity($taskUpdate);
                    unset($taskUpdate);
                    unset($formUpdateTask);
                    $taskUpdate = new Task();
                    $formUpdateTask = $this->createForm(UpdateTaskType::class, $taskUpdate);
                    return $this->redirect($request->getUri());
            }
        }

        return $this->render('task_creator.html.twig',
            array(
                'tree' => $treeDom,
                'formCreateTask' => $formCreateTask->createView(),
                'formUpdateTask' => $formUpdateTask->createView(),
                'tags' => $tags,
                'formStatistic' => $formInterval->createView()
            )
        );
    }

}