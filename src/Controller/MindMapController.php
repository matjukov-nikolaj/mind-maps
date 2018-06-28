<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\MindMap;

class MindMapController extends Controller
{
    private function RenderMindMapCreator()
    {
        return $this->render('mind_maps_creator.html.twig');
    }

    private function GetMindMapEntity($name, $userId)
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
     * @Route("/mind_map/{name}")
     */

    public function MindMapsAction($name)
    {
        return $this->RenderMindMapCreator();
    }

    /**
     * @Route("/create_mind_map", name="create_mind_map")
     */

    public function CreateMindMapsAction()
    {
        return $this->RenderMindMapCreator();
    }

    /**
     * @Route("/save_mind_map")
     */

    public function GetJsonData(Request $request)
    {
        $mindMapsInfo = $request->request->get('data');
        return $this->MindMapHandler($mindMapsInfo);
    }

    private function MindMapHandler($mindMapsInfo)
    {
        $entityManager = $this->getDoctrine()->getManager();
        $userId = $this->getUser()->getId();
        $name = $mindMapsInfo['name'];

        $name = preg_replace('/[^a-zA-Z0-9_-]/s', "", $name);

        $mindMapEntity = $this->GetMindMapEntity($name, $userId);
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

    public function GetMindMapValue(Request $request)
    {
        $mindMapName = $request->request->get('name');
        return $this->MindMapLoader($mindMapName);
    }

    public function MindMapLoader($mindMapName)
    {
        $entityManager = $this->getDoctrine()->getManager();
        $userId = $this->getUser()->getId();

        $mindMapEntity = $this->getMindMapEntity($mindMapName, $userId);

        /** @var MindMap $mindMapEntity */
        return new Response($mindMapEntity->GetValue());
    }

    /**
     * @Route("/delete_mind_map")
     */

    public function DeleteMindMapResponseHandler(Request $request)
    {
        $mindMapInfo = $request->request->get('data');
        return $this->DeleteMindMap($mindMapInfo['name']);
    }

    private function DeleteMindMap($name) {
        $entityManager = $this->getDoctrine()->getManager();
        $userId = $this->getUser()->getId();
        /** @var MindMap $mindMapEntity */
        $mindMapEntity = $this->GetMindMapEntity($name, $userId);

        $mindMap = $entityManager->getRepository(MindMap::class)->find($mindMapEntity->getId());
        $entityManager->remove($mindMap);
        $entityManager->flush();

        return new Response("");
    }

    /**
     * @Route("/update_mind_map")
     */

    public function UpdateMindMapResponseHandler(Request $request)
    {
        $mindMapsInfo = $request->request->get('data');
        var_dump($mindMapsInfo['data']);
        return $this->UpdateMindMap($mindMapsInfo['name'], $mindMapsInfo['data']);
    }

    private function UpdateMindMap($name, $value) {
        $entityManager = $this->getDoctrine()->getManager();
        $userId = $this->getUser()->getId();
        /** @var MindMap $mindMapEntity */
        $mindMapEntity = $this->GetMindMapEntity($name, $userId);
        $mindMap = $entityManager->getRepository(MindMap::class)->find($mindMapEntity->getId());
        $mindMap->setValue($value);
        $entityManager->flush();
        return new Response("");
    }

}