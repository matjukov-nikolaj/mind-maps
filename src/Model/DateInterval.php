<?php
/**
 * Created by PhpStorm.
 * User: MarioSlim
 * Date: 24.01.2019
 * Time: 0:43
 */

namespace App\Model;


class DateInterval
{
    private $from;
    private $to;
    private $success;
    private $failed;
    private $progress;

    /**
     * @return mixed
     */
    public function getFrom()
    {
        return $this->from;
    }

    /**
     * @return mixed
     */
    public function getTo()
    {
        return $this->to;
    }

    /**
     * @param mixed $from
     */
    public function setFrom($from)
    {
        $this->from = $from;
    }

    /**
     * @param mixed $to
     */
    public function setTo($to)
    {
        $this->to = $to;
    }

    /**
     * @return mixed
     */
    public function getFailed()
    {
        return $this->failed;
    }

    /**
     * @return mixed
     */
    public function getProgress()
    {
        return $this->progress;
    }

    /**
     * @return mixed
     */
    public function getSuccess()
    {
        return $this->success;
    }

    /**
     * @param mixed $failed
     */
    public function setFailed($failed)
    {
        $this->failed = $failed;
    }

    /**
     * @param mixed $progress
     */
    public function setProgress($progress)
    {
        $this->progress = $progress;
    }

    /**
     * @param mixed $success
     */
    public function setSuccess($success)
    {
        $this->success = $success;
    }
}