<?php
namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

class PersonalAccountController extends Controller
{
    /**
     * @Route("/personal")
     */
    public function PersonalAccountAction()
    {
        return $this->render('personal_account.html.twig');
    }
}