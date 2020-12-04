<?php

namespace VoiceApp\View;

require_once(__DIR__ . "/../model/Exceptions.php");
require_once(__DIR__ . "/../model/SessionHandler.php");

/**
 * Renders the style changes that the client is requesting.
 * 
 * A command consist of four parts: Verb, Target, Attribute and Value.
 * 1) The verb is what the user wants to do (e.g change, make, navigate)
 * 2) The target is on what the verb will act on (e.g background, text, font)
 * 3) The attribute is what on the target that will be altered (e.g color, size)
 * 4) The value is the new value of the attribute (e.g red, larger)
 * 
 * All parts is not neccecary for all commands.
 * 
 * This file is a work in progress. This file is not complete.
 * 
 */
class StyleView
{
    private $session;

    private $message = "I did not catch that phrase. Can you say it again please";
    private $hasError = false;

    private static $COMMAND = "command";
    private static $VERB = "verb";
    private static $TARGET = "target";
    private static $ATTRIBUTE = "attribute";
    private static $VALUE = "value";

    private static $NO_VERB = "verb not set";
    private static $NO_TARGET = "target not set";
    private static $NO_ATTRIBUTE = "attribute not set";
    private static $NO_VALUE = "value not set";

    public function __construct()
    {
        $this->session = new \VoiceApp\Model\SessionHandler();
    }

    /**
     * Checks if the user is making a command request to change the state of the page.
     * 
     * @return - True if a command is requested, false if not.
     */
    public function isUserMakingCommand(): bool
    {
        return isset($_GET[self::$COMMAND]);
    }

    public function getErrorMessage(): string
    {
        if ($this->hasError) {
            return $this->message;
        }

        return "";
    }

    public function getVerb(): string
    {
        if ($this->isEmptyOrNotSet(self::$VERB)) {
            throw new \VoiceApp\Model\StyleViewException(self::$NO_VERB);
        }
        return $_GET[self::$VERB];
    }

    public function getTarget(): string
    {
        if ($this->isEmptyOrNotSet(self::$TARGET)) {
            throw new \VoiceApp\Model\StyleViewException(self::$NO_TARGET);
        }
        return $_GET[self::$TARGET];
    }

    public function getAttribute(): string
    {
        if ($this->isEmptyOrNotSet(self::$ATTRIBUTE)) {
            throw new \VoiceApp\Model\StyleViewException(self::$NO_ATTRIBUTE);
        }
        return $_GET[self::$ATTRIBUTE];
    }

    public function getValue(): string
    {
        if ($this->isEmptyOrNotSet(self::$VALUE)) {
            throw new \VoiceApp\Model\StyleViewException(self::$NO_VALUE);
        }
        return $_GET[self::$VALUE];
    }

    /**
     * Renders the complete style-tag that will be present in the DOM
     * 
     * @return - the style-HTML tag "<style>...</style>"
     */
    public function renderStyles(): string
    {
        return '<style>' . $this->generateStyleBlock() . '</style>';
    }

    public function setStyles(string $target, string $attribute, string $value): void
    {
        if ($target == 'theme') {
            $this->session->setTheme($value);
        } else {
            $newCSS = $this->generateCSSVariable($target, $attribute, $value);
            $this->session->setNewCSS($newCSS, $target);
        }
    }

    private function generateStyleBlock(): string
    {
        $currentTheme = $this->session->getTheme();

        return ':root {'
            . $this->getTheme($currentTheme)
            . $this->session->getCurrentCSS()
            . '}';
    }

    private function getTheme(string $theme): string
    {
        return $theme == 'dark' ? $this->darkTheme() : $this->lightTheme();
    }

    private function isEmptyOrNotSet(string $value): bool
    {
        return !isset($_GET[$value]) || empty($_GET[$value]);
    }

    private function generateCSSVariable($target, $attribute, $value)
    {
        return "--$target-$attribute: $value;";
    }

    private function darkTheme(): string
    {
        return "
            --background-color: rgb(0 30 33);
            --segment-color: rgb(68 79 80);
            --focus-color: rgb(113 117 117);
            --target-color: rgb(110 119 119);
            --separation-color: rgb(3 62 68);
            --separation-alt-color: rgb(109 116 117);
            --accent-color: #ff9200;
            --accent-color-darker: #d7810e;
            --text-color: rgb(230, 228, 228);
            --text-color-light: #ffffff;
            --speech-bubble: #a6732f;
        ";
    }

    private function lightTheme(): string
    {
        return "
            --background-color: rgb(253 255 254);
            --segment-color: rgb(255 255 255);
            --focus-color: #ffffff;
            --target-color: rgb(255 255 255);
            --separation-color: rgb(154 195 244);
            --separation-alt-color: rgb(197 215 239);
            --accent-color: #7ca0d1;
            --accent-color-darker: #5e64a0;
            --text-color: rgb(68 67 67);
            --text-color-light: #ffffff;
            --speech-bubble: rgb(242 247 255);
            --standard_margin-top: 20px;
            --error-message-color: red;
        ";
    }
}
