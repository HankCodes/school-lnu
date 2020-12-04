<?php

require_once('view/LoginView.php');
require_once('view/DateTimeView.php');
require_once('view/LayoutView.php');
require_once('view/RegisterUser.php');

require_once('controller/RegisterUser.php');
require_once('controller/Authentication.php');

require_once("../common/Auther/Auther.php");

/**
 * Wrapper class for demonstrating the Auther authentication module.
 */
class Application
{

    private $auther;
    private $loginView;
    private $dateView;
    private $layoutView;
    private $regUserView;
    private $register;
    private $auth;

    private static $PATH_TO_AUTHER_SETTINGS = "auther.settings.json";
    private static $PATH_TO_ERROR_LOG = __DIR__ . "/../logs/login_errors.txt";

    public function __construct()
    {
        try {
            $this->auther = new \Auther\Auther(self::$PATH_TO_AUTHER_SETTINGS);

            $this->loginView = new \View\LoginView($this->auther);
            $this->dateView = new \View\DateTimeView();
            $this->layoutView = new \View\LayoutView();
            $this->regUserView = new \View\RegisterUser();

            $this->register = new \Controller\RegisterUser($this->regUserView, $this->auther);
            $this->auth = new \Controller\Authentication($this->loginView, $this->auther);
        } catch (\Exception $e) {
            error_log($e->getMessage(), 3, self::$PATH_TO_ERROR_LOG);
        }
    }

    public function run(): void
    {
        $this->runRegisterController();
        $this->runAuthController();
        $this->renderHTML();
    }

    private function runRegisterController(): void
    {
        $this->register->userRegistrationHandler();
    }

    private function runAuthController(): void
    {
        $this->auth->loginWithCookieHandler();
        $this->auth->logInAttemptHandler();
        $this->auth->logOutAttemptHandler();
    }

    /** Renders the HTML for the application
     * 
     * @return - Void but writes to the output buffter.
     */
    private function renderHTML(): void
    {
        $this->layoutView->render(
            $this->auther->isLoggedIn(),
            $this->loginView,
            $this->regUserView,
            $this->dateView,
            $this->auther
        );
        $this->auther->cleanUp();
    }
}
