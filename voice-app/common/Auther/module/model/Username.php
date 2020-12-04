<?php

namespace Auther\Model;

require_once(__DIR__ . "/../assets/CustomErrors.php");

class Username
{
    private $username;

    public function __construct(string $username)
    {
        if (strlen($username) < \Auther\Constants::$USERNAME_MIN_LENGTH) {
            throw new \Auther\Exceptions\ModelException(\Auther\Constants::$USERNAME_TOO_SHORT);
        }
        $this->username = htmlspecialchars($username);
    }

    public function getUsername()
    {
        return $this->username;
    }
}
