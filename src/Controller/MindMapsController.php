<?php
namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

class MindMapsController extends Controller
{
    /**
     * @Route("/mind_maps")
     */
    public function MindMapsAction()
    {
        return $this->render('mind_maps_creator.html.twig');
    }
}