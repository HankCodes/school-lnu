<?php

namespace Auther\Controller;

require_once(__DIR__ . "/../model/User.php");
require_once(__DIR__ . "/../assets/CustomErrors.php");

class RegisterUser
{
    private static $REGISTRATION_SUCCESS = "Registered new user.";

    public function RegisterUserhandler(
        string $username,
        string $password,
        string $passwordRepeat,
        \Auther\Model\DAL\UserDB $db,
        \Auther\Model\DAL\SessionHandler $session
    ) {
        try {
            $session->setLastEnteredUsername($this->stripHTMLTags($username));
            $session->setUsernameSurviveReloadOnce(true);

            $this->comparePasswords($password, $passwordRepeat);

            $user = new \Auther\Model\User($username, $password, "false");
            $db->saveUser($user);

            $session->setMessage(self::$REGISTRATION_SUCCESS);
            $session->setMessageSurviveReloadOnce(true);
        } catch (\Auther\Exceptions\ModelException |
        \Auther\Exceptions\DatabaseException |
        \Auther\Exceptions\ControllerException $e) {
            throw new \Auther\Exceptions\ControllerException($e->getMessage());
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }

    private function stripHTMLTags(string $username): string
    {
        return filter_var($username, FILTER_SANITIZE_STRING);
    }

    private function comparePasswords(string $password, string $passwordToCheck)
    {
        if ($password !== $passwordToCheck) {
            // TODO check of the message is correct. The dot maybe must be present to pass online tests
            throw new \Auther\Exceptions\ControllerException(\Auther\Constants::$PASSWORDS_DO_NOT_MATCH . ".");
            // throw new \Auther\Exceptions\ControllerException("Passwords do not match.");
        }
    }
}
