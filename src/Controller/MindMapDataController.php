<?php

namespace App\Controller;

use App\Entity\MindMap;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class MindMapDataController extends Controller
{
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

    private function replaceIncorrectCharsInFileName($name) {
        return preg_replace('/[^а-яА-Яa-zA-Z0-9_-]/u', "", $name);
    }

    public function checkMindMapName($name) {
        $name = $this->replaceIncorrectCharsInFileName($name);
        $userId = $this->getUser()->getId();
        $mindMapEntity = $this->getMindMapEntity($name, $userId);
        return $mindMapEntity ? $mindMapEntity->getName() : "";
    }

    public function saveMindMap($mindMapsInfo)
    {
        $userId = $this->getUser()->getId();
        $name = $this->replaceIncorrectCharsInFileName($mindMapsInfo['name']);
        $entityManager = $this->getDoctrine()->getManager();
        $mindMap = new MindMap();
        $mindMap->setUserId($userId);
        $mindMap->setName($name);
        $mindMap->setValue($mindMapsInfo['data']);

        $entityManager->persist($mindMap);
        $entityManager->flush();
    }

    public function getMindMapValue($mindMapName)
    {
        $userId = $this->getUser()->getId();
        $mindMapEntity = $this->getMindMapEntity($mindMapName, $userId);
        /** @var MindMap $mindMapEntity */
        return $mindMapEntity->getValue();
    }

    public function deleteMindMap($name)
    {
        $entityManager = $this->getDoctrine()->getManager();
        $userId = $this->getUser()->getId();
        /** @var MindMap $mindMapEntity */
        $mindMapEntity = $this->getMindMapEntity($name, $userId);

        $mindMap = $entityManager->getRepository(MindMap::class)->find($mindMapEntity->getId());
        $entityManager->remove($mindMap);
        $entityManager->flush();
    }

    public function updateMindMap($name, $value)
    {
        $entityManager = $this->getDoctrine()->getManager();
        $userId = $this->getUser()->getId();
        /** @var MindMap $mindMapEntity */
        $mindMapEntity = $this->getMindMapEntity($name, $userId);
        $mindMap = $entityManager->getRepository(MindMap::class)->find($mindMapEntity->getId());
        $mindMap->setValue($value);
        $entityManager->flush();
    }
}