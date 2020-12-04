<?php

namespace Auther\Model;

require_once(__DIR__ . "/../assets/CustomErrors.php");

class Password
{
    private $password;

    public function __construct(string $password)
    {
        if (strlen($password) < \Auther\Constants::$PASSWORD_MIN_LENGTH) {
            throw new \Auther\Exceptions\ModelException(\Auther\Constants::$PASSWORD_TOO_SHORT);
        }
        $this->password = $password;
    }

    public function getPassword()
    {
        return $this->password;
    }
}
