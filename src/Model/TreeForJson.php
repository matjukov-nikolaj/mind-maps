<?php
/**
 * Created by PhpStorm.
 * User: MarioSlim
 * Date: 28.09.2018
 * Time: 17:14
 */

namespace App\Model;


class TreeForJson
{
    public $root;

    public function __construct($rootTitle)
    {
        $this->root = new NodeForJson($rootTitle);
    }
}