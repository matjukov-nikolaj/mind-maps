<?php

namespace App\Controller;

use Symfony\Component\DependencyInjection\Tests\Compiler\C;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\MindMap;

class MindMapController extends MindMapDataController
{
    private function renderMindMapCreator()
    {
        return $this->render('mind_maps_creator.html.twig');
    }

    /**
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

    public function mindMapSaveResponseHandler(Request $request)
    {
        $mindMapsInfo = $request->request->get('data');
        $existingName = $this->checkMindMapName($mindMapsInfo['name']);
        if ($existingName)
        {
            return new Response($existingName);
        }
        $this->saveMindMap($mindMapsInfo);
        return new Response("");
    }

    /**
     * @Route("/get_mind_map_value")
     */

    public function getMindMapValueResponseHandler(Request $request)
    {
        $mindMapName = $request->request->get('name');
        $value = $this->getMindMapValue($mindMapName);
        return new Response($value);
    }

    /**
     * @Route("/delete_mind_map")
     */

    public function deleteMindMapResponseHandler(Request $request)
    {
        $mindMapInfo = $request->request->get('data');
        $this->deleteMindMap($mindMapInfo['name']);
        return new Response("");
    }

    /**
     * @Route("/update_mind_map")
     */

    public function updateMindMapResponseHandler(Request $request)
    {
        $mindMapsInfo = $request->request->get('data');
        $this->updateMindMap($mindMapsInfo['name'], $mindMapsInfo['data']);
        return new Response("");
    }
}