<?php

namespace App\Controller;

use App\Entity\MindMap;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\User;

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

    private function getNameOfRoot($value) {
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

    /**
     * @Route("/personal")
     */

    public function personalAccountAction()
    {
        $mindMapInfo = $this->getUserMindMapsInfo();
        $names = $mindMapInfo['names'];
        $rootNames = $mindMapInfo['rootNames'];
        return $this->render(
            'personal_account.html.twig',
            array(
                'username' => $this->getUser()->getUsername(),
                'mindMapNames' => $names,
                'mindMapRootNames' => $rootNames,
            )
        );
    }

}