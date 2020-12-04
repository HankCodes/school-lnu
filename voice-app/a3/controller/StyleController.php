<?php

namespace VoiceApp\Controller;

require_once(__DIR__ . "/../model/Exceptions.php");

class StyleController
{
    private $view;
    private $auther;
    private $logger;

    private $verb;
    private $target;
    private $attribute;
    private $value;

    private static $LOG_OUT = "logout";

    public function __construct(
        \VoiceApp\View\StyleView $view,
        \Auther\Auther $auther,
        \VoiceApp\View\ErrorLogger $logger
    ) {
        $this->view = $view;
        $this->auther = $auther;
        $this->logger = $logger;
    }

    /**
     * Handles the commads to change the application state from the client.
     */
    public function commandHandler(): void
    {
        if ($this->view->isUserMakingCommand() && $this->auther->isLoggedIn()) {
            try {
                $this->extractCommands();

                if ($this->verb == self::$LOG_OUT) {
                    $this->auther->logOutUser();
                } else {
                    $this->view->setStyles($this->target, $this->attribute, $this->value);
                }
            } catch (\Exception $e) {
                $this->logger->writeToLog($e->getMessage());
            }
        }
    }

    private function extractCommands(): void
    {
        $this->verb = $this->view->getVerb();
        $this->target = $this->view->getTarget();
        $this->attribute = $this->view->getAttribute();
        $this->value = $this->view->getValue();
    }
}
