<?php

namespace Controller;

class Authentication
{
    private $view;
    private $auther;

    public function __construct(\View\LoginView $view, \Auther\Auther $auther)
    {
        $this->view = $view;
        $this->auther = $auther;
    }

    public function loginAttemptHandler()
    {
        if ($this->view->userMakesLoginAttempt() && !$this->auther->isLoggedin()) {
            $username = $this->view->getUsername();
            $password = $this->view->getPassword();
            $presistLogIn = $this->view->getPresistLogIn();

            $this->auther->authUser($username, $password, $presistLogIn);

            $this->view->setMessageToDisplay($this->auther->getMessage());
        }
    }

    public function logOutAttemptHandler()
    {
        if ($this->auther->isLoggedin() && $this->view->userMakesLogoutAttempt()) {
            $this->auther->logOutUser();
            $this->view->setMessageToDisplay($this->auther->getMessage());
        }
    }

    public function loginWithCookieHandler()
    {
        $this->auther->authWithCookies();
        $this->view->setMessageToDisplay($this->auther->getMessage());
    }
}
