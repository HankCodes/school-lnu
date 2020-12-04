<?php

namespace Auther\Model\DAL;

class CookieHandler
{
    private $generatedPassword;

    // TODO - Move to MessageConstants?
    // cookiePassword is set to LoginView::CookiePassword in order to pass online tests
    private static $cookiePassword = "LoginView::CookiePassword";
    private static $cookieUsername = "Auther_CookieName";

    public function create(string $username)
    {
        $this->generateCookiePassword();
        setcookie(self::$cookieUsername, $username, time() + 3600);
        setcookie(self::$cookiePassword, $this->generatedPassword, time() + 3600);
    }

    public function delete(): void
    {
        setcookie(self::$cookieUsername, "", time() - 3600);
        setcookie(self::$cookiePassword, "", time() - 3600);
    }

    public function getCurrentCookiePassword(): string
    {
        return $this->generatedPassword;
    }

    public function getUsername(): string
    {
        if (!isset($_COOKIE[self::$cookieUsername])) {
            $_COOKIE[self::$cookieUsername] = "";
        }

        return $_COOKIE[self::$cookieUsername];
    }

    public function getPassword(): string
    {
        if (!isset($_COOKIE[self::$cookiePassword])) {
            $_COOKIE[self::$cookiePassword] = "";
        }
        return $_COOKIE[self::$cookiePassword];
    }

    private function generateCookiePassword(): void
    {
        $this->generatedPassword = md5(rand());
    }
}
