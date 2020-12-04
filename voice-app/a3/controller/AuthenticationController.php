<?php

namespace VoiceApp\Controller;

class Authentication
{
    private $loginView;
    private $mainView;
    private $auther;
    private $logger;

    public function __construct(
        \VoiceApp\View\LoginView $loginView,
        \VoiceApp\View\MainView $mainView,
        \Auther\Auther $auther,
        \VoiceApp\View\ErrorLogger $logger
    ) {
        $this->loginView = $loginView;
        $this->mainView = $mainView;
        $this->auther = $auther;

        $this->logger = $logger;
    }

    public function loginAttemptHandler(): void
    {
        if ($this->loginView->userMakesLoginAttempt() && !$this->auther->isLoggedin()) {
            $username = $this->loginView->getUsername();
            $password = $this->loginView->getPassword();
            $presistLogIn = $this->loginView->getPresistLogIn();

            try {
                $this->auther->authUser($username, $password, $presistLogIn);

                $this->loginView->setMessageToDisplay($this->auther->getMessage());
                $this->loginView->setLastEnteredUsername($this->auther->getLastEnteredUsername());
            } catch (\Exception $e) {
                $this->logger->writeToLog($e->getMessage());
            }
        }
    }

    public function logOutAttemptHandler(): void
    {
        if ($this->auther->isLoggedin() && $this->mainView->userMakesLogoutAttempt()) {
            $this->auther->logOutUser();
            $this->loginView->setMessageToDisplay($this->auther->getMessage());
        }
    }

    public function loginWithCookieHandler(): void
    {
        if (!$this->auther->isLoggedIn()) {
            try {
                $this->auther->authWithCookies();
            } catch (\Exception $e) {
                $this->logger->writeToLog($e->getMessage());
            }
        }
    }
}
