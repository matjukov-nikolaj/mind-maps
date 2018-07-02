<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\MindMap;

class MindMapController extends Controller
{
    private function renderMindMapCreator()
    {
        return $this->render('mind_maps_creator.html.twig');
    }

    private function getMindMapEntity($name, $userId)
    {
        $mindMap = $this->getDoctrine()
            ->getRepository(MindMap::class)
            ->findOneBy(
                array(
                    'name' => $name,
                    'user_id' => $userId
                )
            );

        return $mindMap;
    }

    /**
     *
     * @Route("/mind_map/{name}")
     */

    public function mindMapsAction($name)
    {
        return $this->renderMindMapCreator();
    }

    /**
     * @Route("/create_mind_map", name="create_mind_map")
     */

    public function createMindMapsAction()
    {
        return $this->renderMindMapCreator();
    }

    /**
     * @Route("/save_mind_map")
     */

    public function getJsonData(Request $request)
    {
        $mindMapsInfo = $request->request->get('data');
        return $this->mindMapHandler($mindMapsInfo);
    }

    private function mindMapHandler($mindMapsInfo)
    {
        $entityManager = $this->getDoctrine()->getManager();
        $userId = $this->getUser()->getId();
        $name = $mindMapsInfo['name'];
        $name = preg_replace('/[^а-яА-Яa-zA-Z0-9_-]/u', "", $name);
        $mindMapEntity = $this->getMindMapEntity($name, $userId);
        if ($mindMapEntity) {
            /** @var MindMap $mindMapName */
            return new Response($mindMapEntity->getName());
        }

        $mindMap = new MindMap();
        $mindMap->setUserId($userId);
        $mindMap->setName($name);
        $mindMap->setValue($mindMapsInfo['data']);

        $entityManager->persist($mindMap);

        $entityManager->flush();

        return new Response("");
    }

    /**
     * @Route("/get_mind_map_value")
     */

    public function getMindMapValue(Request $request)
    {
        $mindMapName = $request->request->get('name');
        return $this->mindMapLoader($mindMapName);
    }

    public function mindMapLoader($mindMapName)
    {
        $entityManager = $this->getDoctrine()->getManager();
        $userId = $this->getUser()->getId();
        $mindMapEntity = $this->getMindMapEntity($mindMapName, $userId);
        /** @var MindMap $mindMapEntity */
        return new Response($mindMapEntity->getValue());
    }

    /**
     * @Route("/delete_mind_map")
     */

    public function deleteMindMapResponseHandler(Request $request)
    {
        $mindMapInfo = $request->request->get('data');
        return $this->deleteMindMap($mindMapInfo['name']);
    }

    private function deleteMindMap($name)
    {
        $entityManager = $this->getDoctrine()->getManager();
        $userId = $this->getUser()->getId();
        /** @var MindMap $mindMapEntity */
        $mindMapEntity = $this->getMindMapEntity($name, $userId);

        $mindMap = $entityManager->getRepository(MindMap::class)->find($mindMapEntity->getId());
        $entityManager->remove($mindMap);
        $entityManager->flush();

        return new Response("");
    }

    /**
     * @Route("/update_mind_map")
     */

    public function updateMindMapResponseHandler(Request $request)
    {
        $mindMapsInfo = $request->request->get('data');
        var_dump($mindMapsInfo['name']);
        return $this->updateMindMap($mindMapsInfo['name'], $mindMapsInfo['data']);
    }

    private function updateMindMap($name, $value)
    {
        $entityManager = $this->getDoctrine()->getManager();
        $userId = $this->getUser()->getId();
        /** @var MindMap $mindMapEntity */
        $mindMapEntity = $this->getMindMapEntity($name, $userId);
        $mindMap = $entityManager->getRepository(MindMap::class)->find($mindMapEntity->getId());
        $mindMap->setValue($value);
        $entityManager->flush();
        return new Response("");
    }

}