<?php

namespace App\Controller;

use App\Entity\MindMap;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\User;

class PersonalAccountController extends Controller
{
    private function GetUserMindMaps()
    {
        $currentUserId = $this->getUser()->getId();
        $userMindMaps = $this->getDoctrine()
            ->getRepository(MindMap::class)
            ->findBy(
                array('user_id' => $currentUserId)
            );

        $mindMaps = array();
        for ($i = 0; $i < COUNT($userMindMaps); ++$i) {
            /** @var MindMap $currMindMap */
            $currMindMap = $userMindMaps[$i];
            array_push($mindMaps, $currMindMap->getName());
        }
        return $mindMaps;
    }

    /**
     * @Route("/personal")
     */

    public function PersonalAccountAction()
    {
        return $this->render(
            'personal_account.html.twig',
            array(
                'username' => $this->getUser()->getUsername(),
                'mindMapsNames' => $this->GetUserMindMaps(),
            )
        );
    }

}