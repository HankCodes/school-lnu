<?php

namespace Auther\Model;

require_once("Password.php");
require_once("Username.php");
require_once(__DIR__ . "/../assets/CustomErrors.php");

class Credentials
{
    private $password;
    private $username;
    private $presistLogin = false;

    public function __construct(string $username, string $password, bool $presistLogin)
    {
        $this->validateCredentials($username, $password);
        $this->username = new \Auther\Model\Username($username);
        $this->password = new \Auther\Model\Password($password);

        // TODO refine this check for valid input
        if ($presistLogin == null || strlen($presistLogin) < 1) {
            $this->presistLogin = false;
        } else {
            $this->presistLogin = true;
        }
    }

    public function getPassword(): string
    {
        return $this->password->getPassword();
    }

    public function getUsername(): string
    {
        return $this->username->getUsername();
    }

    public function getPresistLogin(): bool
    {
        return $this->presistLogin;
    }

    private function validateCredentials(string $username, string $password)
    {
        $this->throwErrorIfForbiddenCharacters($username);
        $this->checkUsernameAndPasswordLength($username, $password);
    }

    private function checkUsernameAndPasswordLength(string $username, string $password)
    {
        $errorMessage = array();

        if (strlen($username) < \Auther\Constants::$USERNAME_MIN_LENGTH) {
            $errorMessage[] = \Auther\Constants::$USERNAME_TOO_SHORT;
        }
        if (strlen($password) < \Auther\Constants::$PASSWORD_MIN_LENGTH) {
            $errorMessage[] = \Auther\Constants::$PASSWORD_TOO_SHORT;
        }
        if (count($errorMessage) > 0) {
            throw new \Auther\Exceptions\ModelException(implode("<br> ", $errorMessage));
        }
    }

    private function throwErrorIfForbiddenCharacters(string $username)
    {
        if (preg_match(\Auther\Constants::$VALID_USERNAME_FORMAT, $username)) {
            throw new \Auther\Exceptions\ModelException(\Auther\Constants::$INVALID_USERNAME_FORMAT);
        }
    }
}
