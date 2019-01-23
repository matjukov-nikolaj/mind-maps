<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\TagTaskRepository")
 */
class TagTask
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     */
    private $task_id;

    /**
     * @ORM\Column(type="integer")
     */
    private $tag_id;

    public function getId()
    {
        return $this->id;
    }

    public function getTaskId(): ?int
    {
        return $this->task_id;
    }

    public function setTaskId(int $task_id): self
    {
        $this->task_id = $task_id;

        return $this;
    }

    public function getTagId(): ?int
    {
        return $this->tag_id;
    }

    public function setTagId(int $tag_id): self
    {
        $this->tag_id = $tag_id;

        return $this;
    }
}
