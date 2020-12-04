<?php

namespace Auther\Model;

require_once("Credentials.php");

class User
{

    private $credentials;

    public function __construct(string $username, string $password, bool $presistLogin)
    {
        $this->credentials = new \Auther\Model\Credentials($username, $password, $presistLogin);
    }

    public function getCredentials(): \Auther\Model\Credentials
    {
        return $this->credentials;
    }

    public function getUsername(): string
    {
        return $this->credentials->getUsername();
    }

    public function getPassword(): string
    {
        return $this->credentials->getPassword();
    }

    public function getPresistLogin(): bool
    {
        return $this->credentials->getPresistLogin();
    }
}
