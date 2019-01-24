<?php

namespace App\Controller;

use App\Entity\Comment;
use App\Entity\MindMap;
use App\Entity\Tag;
use App\Entity\TagTask;
use App\Entity\TaskAccess;
use App\Entity\User;
use App\Entity\UserInfo;
use App\Form\OpenAccessType;
use App\Form\TagType;
use App\Model\UserModel;
use DateTime;
use Doctrine\DBAL\Types\DateTimeType;
use Doctrine\ORM\Query\ResultSetMapping;
use function MongoDB\BSON\toJSON;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use App\Form\UserModelType;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Task;
use App\Form\CreateTaskType;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

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

    private function getUserInfoEntity($userId)
    {
        return $this->getDoctrine()
            ->getRepository(User::class)
            ->find($userId);
    }

    private function getExistingTasksAccess($user_id)
    {
        $userTask = $this->get('doctrine.orm.default_entity_manager')
        ->getRepository(TaskAccess::class)
        ->findByUserId($user_id);
        $result = array();
        foreach ($userTask as $task) {
            $current = $task["user_id"];
            if ($current != $this->getUser()->getId()) {
                array_push($result, $task);
            }
        }
        return $result;
    }

    private function getExistingTags($user_id)
    {
        $tag = $this->get('doctrine.orm.default_entity_manager')
            ->getRepository(Tag::class)
            ->findByUserId($user_id);

        return $tag;
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
        $currentTime->setTimezone(new \DateTimeZone('Europe/Moscow'));
        $task->setStartTime($currentTime->getTimestamp());
        $userId = $this->getUser()->getId();
        $task->setUserId($userId);
        $task->setComplete(0);
        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->persist($task);
        $entityManager->flush();
        $insertedTask = $this->get('doctrine.orm.default_entity_manager')
            ->getRepository(Task::class)->getTaskIdByUserIdAndStartTime($userId, $task->getStartTime());
        $taskAccess = new TaskAccess();
        $taskAccess->setUserId($userId);
        $taskAccess->setTaskId($insertedTask[0]["id"]);
        $entityManager->persist($taskAccess);
        $entityManager->flush();
    }

    private function generateUniqueFileName()
    {
        $userId = $this->getUser()->getId();
        $time = new \DateTime();
        return $userId . "_" . $time->format('U');
    }

    private function processSavingOpenAccessEntity(TaskAccess $taskAccess)
    {
        $taskId = $taskAccess->getTaskId();
        $userId = $taskAccess->getUserId();
        if (!$forumTasks = $this->get('doctrine.orm.default_entity_manager')
            ->getRepository(TaskAccess::class)->isExists($taskId, $userId))
        {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($taskAccess);
            $entityManager->flush();
        }
    }

    private function getTasksForForum()
    {
        $forumTasks = $this->get('doctrine.orm.default_entity_manager')
            ->getRepository(TaskAccess::class)
            ->findTaskAccessByUserId($this->getUser()->getId());
        return $forumTasks;
    }

    private function getCommentsForTask()
    {
        $comments = $this->get('doctrine.orm.default_entity_manager')
            ->getRepository(TaskAccess::class)
            ->findComments($this->getUser()->getId());
        return $comments;
    }

    private function getTaskCommentsMap($comments, $taskForForum)
    {
        $emptyArray = array();
        $result = array();
        foreach ($taskForForum as $task) {
            $result[$task["task_id"]] = $emptyArray;
        }

        foreach ($comments as $comment) {
            if (array_key_exists($comment["task_id"], $result)) {
                array_push($result[$comment["task_id"]], $comment);
            }
        }
        return $result;
    }

    private function processSavingUserInfo(UserModel $userInfo)
    {
        /** @var UploadedFile $file */
        $file = $userInfo->getPhoto();
        $fileName = "";
        if ($file == null) {
            $fileName = "base";
        } else {
            $fileName = $this->generateUniqueFileName() . '.' . $file->guessExtension();
        }

        try {
            $file->move(
                $this->getParameter('photos_directory'),
                $fileName
            );
        } catch (FileException $e) {
            echo $e->getMessage();
        }

        $userInfo->setPhoto($fileName);
        $userId = $this->getUser()->getId();
        /** @var User $userEntity */
        $userEntity = $this->getUserInfoEntity($userId);
        $userEntity->setPhoto($fileName);
        $userEntity->setFirstName($userInfo->getFirstName());
        $userEntity->setLastName($userInfo->getLastName());
        $userEntity->setMiddleName($userInfo->getMiddleName());

        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->persist($userEntity);
        $entityManager->flush();
    }

    /**
     * @Route("/create_comment")
     */
    public function createCommentForTask(Request $request)
    {
        $id = (int)$request->request->get('id');
        $value = (string)$request->request->get('value');
        $comment = new Comment();
        $comment->setUserId($this->getUser()->getId());
        $comment->setTaskId($id);
        $comment->setValue($value);
        $currentTime = new \DateTime();
        $currentTime->setTimezone(new \DateTimeZone('Europe/Moscow'));
        $comment->setDate($currentTime);
        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->persist($comment);
        $entityManager->flush();
        return new Response();
    }

    /**
     * @Route("/delete_comment")
     */
    public function deleteComment(Request $request)
    {
        $id = (int)$request->request->get('id');
        $entityManager = $this->getDoctrine()->getManager();
        $comment = $entityManager->getRepository(Comment::class)->find($id);
        $entityManager->remove($comment);
        $entityManager->flush();
        return new Response();
    }

    /**
     * @Route("/delete_access")
     */
    public function deleteAccessUserInTask(Request $request)
    {
        $id = (int)$request->request->get('id');
        $entityManager = $this->getDoctrine()->getManager();
        $taskAccess = $entityManager->getRepository(TaskAccess::class)->find($id);
        $entityManager->remove($taskAccess);
        $entityManager->flush();
        return new Response();
    }

    /**
     * @Route("/delete_tag")
     */
    public function deleteTag(Request $request)
    {
        $id = (int)$request->request->get('id');
        $entityManager = $this->getDoctrine()->getManager();
        $tag = $entityManager->getRepository(Tag::class)->find($id);
        $this->get('doctrine.orm.default_entity_manager')
            ->getRepository(TagTask::class)
            ->removeTagTaskByTag($id);
        $entityManager->remove($tag);
        $entityManager->flush();
        return new Response();
    }

    /**
     * @Route("/check_tag_name")
     */

    public function checkTagName(Request $request)
    {
        $name = (string)$request->request->get('name');
        $userId = $this->getUser()->getId();
        $tag = $this->getDoctrine()
            ->getRepository(Tag::class)
            ->findOneBy(
                array(
                    'name' => $name,
                    'user_id' => $userId
                )
            );
        return new Response($tag);
    }

    /**
     * @Route("/get_personal_information")
     */

    public function getPersonalInformation(Request $request)
    {
        $userId = $this->getUser()->getId();
        $userInfo = $this->getUserInfoEntity($userId);
        if ($userInfo != null) {
            $encoders = array(new XmlEncoder(), new JsonEncoder());
            $normalizers = array(new ObjectNormalizer());

            $serializer = new Serializer($normalizers, $encoders);
            $jsonContent = $serializer->serialize($userInfo, "json");
            return new Response($jsonContent);
        }
        return new Response();
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

        $existingTaskAccess = $this->getExistingTasksAccess($this->getUser()->getId());
        $taskForForum = $this->getTasksForForum();
        $comments = $this->getCommentsForTask();
        $taskCommentsMap = $this->getTaskCommentsMap($comments, $taskForForum);
        $tags = $this->getExistingTags($this->getUser()->getId());

        $task = new Task();
        $GLOBALS['currentUserId'] = $this->getUser()->getId();
        $formTask = $this->createForm(CreateTaskType::class, $task);
        /** @var User $existingUserInfo */
        $existingUserInfo = $this->getUserInfoEntity($this->getUser()->getId());

        $user = new UserModel();
        $formInfo = $this->createForm(UserModelType::class, $user);

        $taskAccess = new TaskAccess();
        $formAccess = $this->createForm(OpenAccessType::class, $taskAccess);

        $tag = new Tag();
        $formTag = $this->createForm(TagType::class, $tag);

        $formTask->handleRequest($request);
        $formInfo->handleRequest($request);
        $formAccess->handleRequest($request);
        $formTag->handleRequest($request);
        if ($request->isMethod('POST')) {
            if ($formTask->isSubmitted() && $formTask->isValid()) {
                /** @var Task $taskEntity */
                $taskEntity = $formTask['parent']->getData();
                if ($taskEntity != null) {
                    $task->setParent($taskEntity->getId());
                }
                $this->processSavingTaskEntity($task);
                unset($entity);
                unset($formTask);
                $task = new Task();
                $formTask = $this->createForm(CreateTaskType::class, $task);
                return $this->redirect($request->getUri());
            } elseif ($formInfo->isSubmitted() && $formInfo->isValid()) {
                $this->processSavingUserInfo($user);
                unset($entity);
                unset($formInfo);
                $userInfo = new UserModel();
                $formInfo = $this->createForm(UserModelType::class, $userInfo);
                return $this->redirect($request->getUri());
            } elseif ($formAccess->isSubmitted() && $formAccess->isValid()) {
                $this->processSavingOpenAccessEntity($taskAccess);
                unset($entity);
                unset($formAccess);
                $taskAccess = new TaskAccess();
                $formAccess = $this->createForm(OpenAccessType::class, $taskAccess);
                return $this->redirect($request->getUri());
            } elseif ($formTag->isSubmitted() && $formTag->isValid()) {
                $entityManager = $this->getDoctrine()->getManager();
                $tag->setUserId($this->getUser()->getId());
                $entityManager->persist($tag);
                $entityManager->flush();
                unset($entity);
                unset($formTag);
                $tag = new Tag();
                $formTag = $this->createForm(TagType::class, $tag);
                return $this->redirect($request->getUri());
            }
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
                'formCreateTask' => $formTask->createView(),
                'userInfo' => $formInfo->createView(),
                'existingUserInfo' => $existingUserInfo,
                'formAccess' => $formAccess->createView(),
                'existingTasks' => $existingTaskAccess,
                'forumTasks' => $taskForForum,
                'taskCommentsMap' => $taskCommentsMap,
                'userId' => $this->getUser()->getId(),
                'tag' => $formTag->createView(),
                'tags' => $tags,
            )
        );
    }

}