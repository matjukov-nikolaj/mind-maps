<?php
namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

class SignInController extends Controller
{
    /**
     * @Route("/sign_in")
     */
    public function signInAction()
    {
        //die();
        //phpinfo();
        return $this->render('sign_in.html.twig');
    }
}
