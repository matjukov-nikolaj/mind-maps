<?php
/**
 * Created by PhpStorm.
 * User: MarioSlim
 * Date: 28.09.2018
 * Time: 17:16
 */

namespace App\Model;


class NodeForJson
{
    public $title;
    public $children;

    public function __construct($rootTitle)
    {
        $this->title = $rootTitle;
        $this->children = [];
    }

    public function addChild($nodeTitle) {
        if (COUNT($this->children) >= 50) {
            return;
        }
        $node = new NodeForJson($nodeTitle);
        array_push($this->children, $node);
        return $this->children[COUNT($this->children) - 1];
    }

    public function appendChild($node) {
        array_push($this->children, $node);
    }

}