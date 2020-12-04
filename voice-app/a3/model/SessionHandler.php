<?php

namespace VoiceApp\Model;

// TODO - rename to StyleSession

// TODO - Add a check for username in the session. 
// In the applications current state (at 2020-10-16) the style is saved on the session cookie that is
// global for the current browser, this means that the style is the same for all users that log in on the same browser.
// The desired behaviour is that users can keep their own style regardless of device. This functionality might also be 
// combined with database storage.
class SessionHandler
{
    private static $PREFIX = "css_session_";
    private static $THEME = "theme";
    private static $LIGHT_THEME = "light";

    public function getTheme(): string
    {
        if (!isset($_SESSION[self::$PREFIX . self::$THEME])) {
            return self::$LIGHT_THEME;
        }

        return $_SESSION[self::$PREFIX . self::$THEME];
    }

    public function setTheme(string $theme): void
    {
        $this->resetCSS();
        $_SESSION[self::$PREFIX . self::$THEME] = $theme;
    }

    public function getCurrentCSS(): string
    {
        return $this->loadCurrentCSS();
    }

    public function setNewCSS(string $cssVariable, string $target): void
    {
        $_SESSION[self::$PREFIX . $target] = $cssVariable;
    }

    private function loadCurrentCSS(): string
    {
        $curenStyles = "";
        foreach ($_SESSION as $key => $value) {
            if ($this->isCSSvariablesInSessionFound($key)) {
                $curenStyles .= "$value \n";
            }
        }

        return $curenStyles;
    }

    private function resetCSS(): void
    {
        foreach ($_SESSION as $key => $value) {
            if ($this->isCSSvariablesInSessionFound($key)) {
                $_SESSION[$key] = "";
            }
        }
    }

    private function isCSSvariablesInSessionFound(string $sessionKey): bool
    {
        return (strpos($sessionKey, self::$PREFIX) !== false && strpos($sessionKey, self::$THEME) === false);
    }
}
