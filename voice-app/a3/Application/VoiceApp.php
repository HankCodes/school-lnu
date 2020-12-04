<?php

/**
 * A vlice controlled web app. This application is able to recievt voice command
 * and change its state accordingly.
 * 
 * @author Henrik Holstad <hh222kt$student.lnu.se>
 * @version 1.0
 */

namespace VoiceApp;

require_once(__DIR__ . "/../view/LogInView.php");
require_once(__DIR__ . "/../view/LayoutView.php");
require_once(__DIR__ . "/../view/styleView.php");
require_once(__DIR__ . "/../view/RegisterView.php");
require_once(__DIR__ . "/../view/Popup.php");
require_once(__DIR__ . "/../view/MainView.php");
require_once(__DIR__ . "/../view/ErrorLogger.php");

require_once(__DIR__ . "/../controller/StyleController.php");
require_once(__DIR__ . "/../controller/AuthenticationController.php");
require_once(__DIR__ . "/../controller/RegisterController.php");

require_once(__DIR__ . "/../assets/Constants.php");
require_once(__DIR__ . "/../../common/Auther/Auther.php");

class VoiceApp
{
    private $logInView;
    private $LayoutView;
    private $styleView;

    private $styleController;
    private $authController;
    private $regController;

    private $auther;
    private static $PATH_TO_AUTHER_SETTINGS = __DIR__ . "/../auther.settings.json";

    public function __construct()
    {
        $this->auther = new \Auther\Auther(self::$PATH_TO_AUTHER_SETTINGS);

        $this->logInView = new \VoiceApp\View\LogInView($this->auther);
        $this->LayoutView = new \VoiceApp\View\LayoutView();
        $this->styleView = new \VoiceApp\View\StyleView();
        $this->regView = new \VoiceApp\View\RegisterView();
        $this->popup = new \VoiceApp\View\Popup();
        $this->mainView = new \VoiceApp\View\MainView();

        $logger = new \VoiceApp\View\ErrorLogger(\VoiceApp\Constants::$PATH_TO_ERROR_FILE);

        $this->styleController = new \VoiceApp\Controller\StyleController($this->styleView, $this->auther, $logger);
        $this->authController = new \VoiceApp\Controller\Authentication($this->logInView, $this->mainView, $this->auther, $logger);
        $this->regController = new \VoiceApp\Controller\RegisterController($this->regView, $this->auther, $logger);
    }

    public function run(): void
    {
        $this->runRegisterController();
        $this->runAuthController();
        $this->styleController->commandHandler();

        $this->LayoutView->renderHTML(
            $this->auther->isLoggedIn(),
            $this->logInView,
            $this->regView,
            $this->styleView,
            $this->mainView,
            $this->popup
        );

        $this->auther->cleanUp();
    }

    private function runRegisterController(): void
    {
        $this->regController->userRegistrationHandler();
    }

    private function runAuthController(): void
    {
        $this->authController->loginWithCookieHandler();
        $this->authController->logInAttemptHandler();
        $this->authController->logOutAttemptHandler();
    }
}
