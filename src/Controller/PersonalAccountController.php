<?php

namespace App\Controller;

use App\Entity\MindMap;
use App\Entity\UserInfo;
use DateTime;
use Doctrine\DBAL\Types\DateTimeType;
use function MongoDB\BSON\toJSON;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use App\Form\UserInfoType;
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
        $allUserInfo = $this->getDoctrine()
            ->getRepository(UserInfo::class)
            ->findBy(
                array('id_user' => $userId), array('date' => 'ASC')
            );
        if (COUNT($allUserInfo) != 0) {
            return $allUserInfo[COUNT($allUserInfo) - 1];
        }
        return null;
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

    private function generateUniqueFileName()
    {
        $userId = $this->getUser()->getId();
        $time = new \DateTime();
        return $userId . "_" . $time->format('U');
    }

    private function processSavingUserInfo(UserInfo $userInfo)
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
        $userInfo->setDate(new DateTime());
        $userId = $this->getUser()->getId();
        $userInfo->setIdUser($userId);
        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->persist($userInfo);
        $entityManager->flush();
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

        $task = new Task();
        $formTask = $this->createForm(CreateTaskType::class, $task);
        $existingUserInfo = $this->getUserInfoEntity($this->getUser()->getId());

        $userInfo = new UserInfo();
        $formInfo = $this->createForm(UserInfoType::class, $userInfo);
        $formTask->handleRequest($request);
        $formInfo->handleRequest($request);
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
            } else if ($formInfo->isSubmitted() && $formInfo->isValid()) {
                $this->processSavingUserInfo($userInfo);
                unset($entity);
                unset($formInfo);
                $userInfo = new UserInfo();
                $formInfo = $this->createForm(UserInfoType::class, $userInfo);
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
            )
        );
    }

}