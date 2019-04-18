<?php

namespace App\Entity;

use phpDocumentor\Reflection\Types\Boolean;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\TaskRepository")
 */
class Task
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
    private $user_id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $name;

    /**
     * @ORM\Column(type="text")
     */
    private $description;

    /**
     * @ORM\Column(type="bigint")
     */
    private $start_time;

    /**
     * @ORM\Column(type="datetime")
     */
    private $end_time;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $completion_time;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $parent;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $complete;

    public function getId()
    {
        return $this->id;
    }

    public function setId($id): self
    {
        $this->id = $id;

        return $this;
    }

    public function getDescription(): ?string
{
    return $this->description;
}

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;
        return $this;
    }

    public function getStartTime()
    {
        return $this->start_time;
    }

    public function setStartTime($start_time)
    {
        $this->start_time = $start_time;

        return $this;
    }

    public function getEndTime(): ?\DateTime
    {
        return $this->end_time;
    }

    public function setEndTime($end_time)
    {
        $this->end_time = $end_time;

        return $this;
    }

    public function getCompletionTime()
    {
        return $this->completion_time;
    }

    public function setCompletionTime($completion_time)
    {
        $this->completion_time = $completion_time;

        return $this;
    }

    public function getParent()
    {
        return $this->parent;
    }

    public function setParent($parentId)
    {
        $this->parent = $parentId;

        return $this;
    }

    public function getUserId(): ?int
    {
        return $this->user_id;
    }

    public function setUserId(int $user_id): self
    {
        $this->user_id = $user_id;

        return $this;
    }

    public function getComplete(): ?int
    {
        return $this->complete;
    }

    public function setComplete($complete): self
    {
        $this->complete = $complete;

        return $this;
    }

}
