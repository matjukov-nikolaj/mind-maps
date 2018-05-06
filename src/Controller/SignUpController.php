<?php
namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

class SignUpController extends Controller
{
    /**
     * @Route("/sign_up")
     */
    public function signUpAction()
    {
        return $this->render('sign_up.html.twig');
    }
}
