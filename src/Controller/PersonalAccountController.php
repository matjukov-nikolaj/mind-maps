<?php

namespace App\Controller;

use App\Entity\MindMap;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use App\Entity\User;

class PersonalAccountController extends Controller
{
    private function GetUserMindMaps()
    {
        $currentUserId = $this->getUser()->getId();

        $mindMaps = $this->getDoctrine()
            ->getRepository(MindMap::class)
            ->findBy(
                array('user_id' => $currentUserId)
            );
//            findOneBy(
//                array('user_id' => $currentUserId, 'name' => 'name_mm_123')
//            );

        //var_dump($mindMaps);
        if (!$mindMaps) {
            throw $this->createNotFoundException(
                'No mind maps found for id ' . $currentUserId
            );
        }

        $check = "123";
        for ($i = 0; $i < COUNT($mindMaps); ++$i) {
            /** @var MindMap $currMindMap */
            $currMindMap = $mindMaps[$i];
//            $currMindMap->getName();
            var_dump($currMindMap->getName());
//            foreach ($currMindMap as $a)
//            {
//                var_dump($check);
//                break;
//            }
            break;
        }

        $mindMapsInfo = array(//'names' => $mindMaps->getName(),
        );
        //var_dump($mindMapsInfo);

        return $mindMapsInfo;
    }

    /**
     * @Route("/personal")
     */

    public function PersonalAccountAction()
    {
        $lol = $this->GetUserMindMaps();
       // var_dump($lol);

        return $this->render(
            'personal_account.html.twig',
            array(
                'username' => $this->getUser()->getUsername()//,
                //'mindMapsNames' => $this->GetUserMindMaps()
            )
        );
    }
}