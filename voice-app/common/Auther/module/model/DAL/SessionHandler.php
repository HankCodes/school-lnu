<?php

namespace Auther\Model\DAL;

class SessionHandler
{

    private $app;
    private $messageSurviveReloadOnce = false;
    private $usernameSurviveReloadOnce = false;

    private static $MESSAGE = "message";
    private static $LAST_ENTERED_NAME = "last_entered_username";
    private static $HTTP_USER_AGENT = "HTTP_USER_AGENT";
    private static $IS_LOGGED_IN = "is_logged_in";

    public function __construct(string $appName)
    {
        $this->app = $appName . "_";
    }

    public function resetMessages(): void
    {
        $_SESSION[$this->app . self::$MESSAGE] = "";
    }

    public function resetLastEnteredUsername(): void
    {
        $_SESSION[$this->app . self::$LAST_ENTERED_NAME] = "";
    }

    public function isLoggedIn(): bool
    {
        if (!isset($_SESSION[$this->app . self::$IS_LOGGED_IN])) {
            $_SESSION[$this->app . self::$IS_LOGGED_IN] = false;
        }

        if ($_SERVER[self::$HTTP_USER_AGENT] !== $this->getUserAgent()) {
            return false;
        }

        return $_SESSION[$this->app . self::$IS_LOGGED_IN];
    }

    public function setIsLoggedIn(bool $isLoggedIn): void
    {
        $_SESSION[$this->app . self::$IS_LOGGED_IN] = $isLoggedIn;
    }

    public function getMessage(): string
    {
        if (!isset($_SESSION[$this->app . self::$MESSAGE])) {
            $_SESSION[$this->app . self::$MESSAGE] = "";
        }
        return $_SESSION[$this->app . self::$MESSAGE];
    }

    public function setMessage(string $message): void
    {
        $_SESSION[$this->app . self::$MESSAGE] = $message;
    }

    public function setLastEnteredUsername(string $username): void
    {
        $_SESSION[$this->app . self::$LAST_ENTERED_NAME] = $username;
    }

    public function getLastEnteredUsername(): string
    {
        if (!isset($_SESSION[$this->app . self::$LAST_ENTERED_NAME])) {
            $_SESSION[$this->app . self::$LAST_ENTERED_NAME] = "";
        }

        return $_SESSION[$this->app . self::$LAST_ENTERED_NAME];
    }

    public function setMessageSurviveReloadOnce(bool $willSurvive): void
    {
        $this->messageSurviveReloadOnce = $willSurvive;
    }

    public function willMessageSurviveReloadOnce(): bool
    {
        return $this->messageSurviveReloadOnce;
    }

    public function setUsernameSurviveReloadOnce(bool $willSurvive): void
    {
        $this->usernameSurviveReloadOnce = $willSurvive;
    }

    public function willUsernameSurviveReloadOnce(): bool
    {
        return $this->usernameSurviveReloadOnce;
    }

    public function setUserAgent(string $userAgent): void
    {
        $_SESSION[$this->app . self::$HTTP_USER_AGENT] = $userAgent;
    }

    public function getUserAgent(): string
    {
        if (!isset($_SESSION[$this->app . self::$HTTP_USER_AGENT])) {
            $_SESSION[$this->app . self::$HTTP_USER_AGENT] = "";
        }
        return $_SESSION[$this->app . self::$HTTP_USER_AGENT];
    }
}
