<?php

namespace Controller;

class RegisterUser
{

    private $view;
    private $auther;

    public function __construct(\View\RegisterUser $view, \Auther\Auther $auther)
    {
        $this->view = $view;
        $this->auther = $auther;
    }

    public function userRegistrationHandler()
    {
        if ($this->view->userRegistrationAttempt()) {
            $username = $this->view->getUsername();
            $password = $this->view->getPassword();
            $passwordRepeat = $this->view->getPasswordRepeat();

            $this->auther->createUser($username, $password, $passwordRepeat);

            $this->setRedirectIfRegistrationSucceeded();

            $this->view->setMessageToDisplay($this->auther->getMessage());
            $this->view->setLastEnteredUsername($this->auther->getLastEnteredUsername());
        }
    }

    private function setRedirectIfRegistrationSucceeded()
    {
        if ($this->auther->isUserRegistered()) {
            $this->view->setRedirect(true);
        }
    }
}
