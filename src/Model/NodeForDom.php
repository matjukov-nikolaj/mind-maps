<?php
/**
 * Created by PhpStorm.
 * User: MarioSlim
 * Date: 28.09.2018
 * Time: 17:16
 */

namespace App\Model;


use App\Entity\Task;

class NodeForDom
{
    public $id;
    public $title;
    public $description;
    public $startTime;
    public $endTime;
    public $parent;
    public $completionTime;
    public $children;
    public $complete;

    public function __construct($taskEntity)
    {
        /** @var Task $taskEntity */
        $this->id = $taskEntity->getId();
        $this->title = $taskEntity->getName();
        $this->description = $taskEntity->getDescription();
        $this->startTime = $taskEntity->getStartTime();
        $this->endTime = $taskEntity->getEndTime();
        $this->completionTime = $taskEntity->getCompletionTime();
        $this->parent = $taskEntity->getParent();
        $this->complete = $taskEntity->getComplete();
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