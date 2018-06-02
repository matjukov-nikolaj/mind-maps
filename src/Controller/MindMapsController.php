<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\MindMap;

class MindMapsController extends Controller
{
    /**
     * @Route("/mind_maps")
     */
//    private $mind_maps;


    public function MindMapsAction()
    {
        return $this->render('mind_maps_creator.html.twig');
    }

    /**
     * @Route("/mind_maps_save")
     */

    public function index(Request $request)
    {
        $mindMapsInfo = $request->request->get('data');

        $entityManager = $this->getDoctrine()->getManager();

        $mindMap = new MindMap();

        $currentUserId = $this->getUser()->getId();
        $mindMap->setUserId($currentUserId);
        $mindMap->setName($mindMapsInfo['name']);
        $mindMap->setValue($mindMapsInfo['data']);

        //доделать время.
        $mindMap->setDate(new \DateTime('2009-02-15 15:16:17'));

        $entityManager->persist($mindMap);

        $entityManager->flush();

        return new Response();
    }
}