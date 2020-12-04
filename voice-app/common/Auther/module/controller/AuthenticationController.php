<?php

namespace Auther\Controller;

require_once(__DIR__ . "/../model/User.php");
require_once(__DIR__ . "/../assets/MessageConstants.php");
require_once(__DIR__ . "/../assets/CustomErrors.php");

class authenticationController
{
    private $userDb;
    private $cookieDb;
    private $session;
    private $cookies;

    private static $HTTP_USER_AGENT = "HTTP_USER_AGENT";

    private static $WELCOME_MESSAGE = "Welcome";
    private static $GOOD_BYE_MESSAGE = "Bye bye!";
    private static $PRESIST_LOGIN_MESSAGE = "Welcome and you will be remembered";
    private static $COOKIE_WELCOME_MESSAGE = "Welcome back with cookie";

    public function __construct(
        \Auther\Model\DAL\SessionHandler $session,
        \Auther\Model\DAL\UserDB $userDb,
        \Auther\Model\DAL\CookieHandler $cookies,
        \Auther\Model\DAL\CookieDB $cookieDb
    ) {
        $this->session = $session;
        $this->userDb = $userDb;
        $this->cookies = $cookies;
        $this->cookieDb = $cookieDb;
    }

    public function authenticate(
        string $username,
        string $password,
        bool $presistLogIn
    ): void {
        $this->session->setLastEnteredUsername($username);

        $this->throwIfEmpty($username, $password);

        $user = new \Auther\Model\User($username, $password, $presistLogIn);
        $this->userDb->authenticateUser($user);

        $this->setSessionVariablesForLoggedInUsers(self::$WELCOME_MESSAGE);

        $this->presistLogIn($user);
    }

    public function logOutUser(): void
    {
        $this->session->setMessage(self::$GOOD_BYE_MESSAGE);
        $this->session->setIsLoggedin(false);
        $this->session->setUserAgent("");

        $this->cookies->delete();
    }

    public function authWithCookies(): void
    {
        if ($this->cookies->getUsername() && $this->cookies->getPassword()) {
            $username = $this->cookies->getUsername();
            $password = $this->cookies->getPassword();

            $this->cookieDb->authenticateUser($username, $password);
            $this->createAndSaveCookiesToDatabase($username);
            $this->setSessionVariablesForLoggedInUsers(self::$COOKIE_WELCOME_MESSAGE);
        }
    }

    private function presistLogIn(\Auther\Model\User $user): void
    {
        if ($user->getPresistLogin()) {
            $this->session->setMessage(self::$PRESIST_LOGIN_MESSAGE);
            $this->createAndSaveCookiesToDatabase($user->getUsername());
        }
    }

    private function createAndSaveCookiesToDatabase(string $username): void
    {
        $this->cookies->create($username);
        $cookiePassword = $this->cookies->getCurrentCookiePassword();

        $this->cookieDb->saveCookie($username, $cookiePassword);
    }

    private function setSessionVariablesForLoggedInUsers(string $message): void
    {
        $this->session->setIsLoggedin(true);
        $this->session->setUserAgent($_SERVER[self::$HTTP_USER_AGENT]);
        $this->session->setMessage($message);
    }

    private function throwIfEmpty(string $username, string $password): void
    {
        if (empty($username)) {
            throw new \Auther\Exceptions\ControllerException(\Auther\Constants::$NO_USERNAME);
        }

        if (empty($password)) {
            throw new \Auther\Exceptions\ControllerException(\Auther\Constants::$NO_PASSWORD);
        }
    }
}
