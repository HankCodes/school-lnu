<?php

namespace VoiceApp\Controller;

class RegisterController
{
    private $view;
    private $auther;
    private $logger;

    public function __construct(
        \VoiceApp\View\RegisterView $view,
        \Auther\Auther $auther,
        \VoiceApp\View\ErrorLogger $logger
    ) {
        $this->view = $view;
        $this->auther = $auther;
        $this->logger = $logger;
    }

    public function userRegistrationHandler(): void
    {
        if ($this->view->userRegistrationAttempt()) {
            $username = $this->view->getUsername();
            $password = $this->view->getPassword();
            $passwordRepeat = $this->view->getPasswordRepeat();

            try {
                $this->auther->createUser($username, $password, $passwordRepeat);

                $this->setRedirectIfRegistrationSucceeded();
                $this->view->setMessageToDisplay($this->auther->getMessage());
                $this->view->setLastEnteredUsername($this->auther->getLastEnteredUsername());
            } catch (\Exception $e) {
                $this->logger->writeToLog($e->getMessage());
            }
        }
    }

    private function setRedirectIfRegistrationSucceeded(): void
    {
        if ($this->auther->isUserRegistered()) {
            $this->view->setRedirect(true);
        }
    }
}
