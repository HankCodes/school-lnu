<?php

/**
 * This is an authentication module aimed to make the creation and authentication process of user accounts
 * on your site easy.
 * 
 * @author Henrik Holstad <hh222kt$student.lnu.se>
 * @version 1.0
 * @package Auther
 */

namespace Auther;

require_once("module/model/DAL/CookieDB.php");
require_once("module/model/DAL/Database.php");
require_once("module/model/DAL/UserDB.php");
require_once("module/model/DAL/SessionHandler.php");
require_once("module/model/DAL/CookieHandler.php");

require_once("module/controller/SettingsController.php");
require_once("module/controller/RegisterUserController.php");
require_once("module/controller/AuthenticationController.php");

require_once("module/view/ErrorLogger.php");

require_once("module/assets/CustomErrors.php");

/**
 * Provides the interface for the module. Consist of public methods for creating and authenticate user accounts.
 */
class Auther
{
    private $settings;
    private $userDb;
    private $cookieDb;
    private $session;
    private $cookies;
    private $logger;
    private $authController;
    private $userRegistered = false;


    private static $WRONG_COOKIE_INFORMATION = "Wrong information in cookies";

    public function __construct(string $pathToSettings)
    {
        try {
            $sc = new \Auther\Controller\SettingsController($pathToSettings);
            $this->settings = $sc->getSettings();

            $this->logger = new \Auther\View\ErrorLogger($this->settings->error_log);

            $db = new \Auther\Model\DAL\Database($this->settings);
            $dbConnection = $db->connect();

            $this->userDb = new \Auther\Model\DAL\UserDB($dbConnection);
            $this->cookieDb = new \Auther\Model\DAL\CookieDB($dbConnection);

            $this->session = new \Auther\Model\DAL\SessionHandler($this->settings->app_name);
            $this->cookies = new \Auther\Model\DAL\CookieHandler();

            $this->authController = new \Auther\Controller\AuthenticationController(
                $this->session,
                $this->userDb,
                $this->cookies,
                $this->cookieDb
            );
        } catch (\Auther\Exceptions\SettingsException $e) {
            die(\Auther\Constants::$AUTHER_FAIL_WRONG_SETTINGS . ": " . $e->getMessage());
        } catch (\Exception $e) {
            $this->logger->writeToLog($e);
            if ($this->settings->terminate_on_db_error) {
                die(\Auther\Constants::$AUTHER_FAIL_FATAL);
            }
        }
    }

    /**
     * Creates a user in the database.
     * 
     * This method should be used with the method .cleanUp() at the end of your index.php to clean up
     * data (e.g messages) that should not presist over page refreshes.
     * 
     * @param string $username - The username for the account.
     * @param string $password - The password for the account.
     * @param string $passwordRepeat - The repeated password for the account.
     * 
     *  Writes to the specified error text file on error.
     */
    public function createUser(string $username, string $password, string $passwordRepeat): void
    {
        try {
            $registerUser = new \Auther\Controller\RegisterUser();
            $registerUser->RegisterUserhandler($username, $password, $passwordRepeat, $this->userDb, $this->session);

            $this->userRegistered = true;
        } catch (\Auther\Exceptions\ControllerException $e) {
            $this->session->setMessage($e->getMessage());
            $this->userRegistered = false;
        } catch (\Exception $e) {
            $this->userRegistered = false;
            $this->logger->writeToLog($e);
        }
    }

    /**
     * Used to check if the request to create a user was successful.
     * 
     * @return - true if successfull registration, false if not.
     */
    public function isUserRegistered(): bool
    {
        return $this->userRegistered;
    }

    /**
     * Authenticates a user.
     * 
     * @param string $username - The username of the account to authenticate.
     * @param string $password - The password of the account to authenticate.
     * @param bool $presistLogIn - If the user still wants to be logged in when broswer is closed.
     * 
     * If the user will presist the login an authentication cookie will be set.
     * 
     * Writes to error textfile upon error. (Failure on authentication will not be included)
     */
    public function authUser(string $username, string $password, bool $presistLogIn): void
    {
        try {
            $this->authController->authenticate(
                $username,
                $password,
                $presistLogIn,
            );
        } catch (\Auther\Exceptions\ControllerException |
        \Auther\Exceptions\DatabaseException $e) {
            $this->session->setMessage($e->getMessage());
        } catch (\Exception $e) {
            $this->logger->writeToLog($e);
        }
    }

    /**
     * Cookie based authentication.
     */
    public function authWithCookies(): void
    {
        if (!$this->isLoggedIn()) {
            try {
                $this->authController->authWithCookies();
            } catch (\Exception $e) {
                $this->session->setIsLoggedIn(false);
                $this->session->setMessage(self::$WRONG_COOKIE_INFORMATION);

                $this->logger->writeToLog($e);
            }
        }
    }

    /**
     * Logs out the user from the aplication.
     */
    public function logOutUser(): void
    {
        $this->authController->logOutUser($this->session, $this->cookies);
    }


    /**
     * Gets the last entered username provided to either Auther::createUswer or Auther::authUser.
     * 
     * @return - username as a string.
     */
    public function getLastEnteredUsername(): string
    {
        return $this->session->getLastEnteredUsername();
    }

    /**
     * Returns a boolean indicating if the user is authenticated or not.
     * 
     * @return - True if authenticated, false if not.
     */
    public function isLoggedIn(): bool
    {
        return $this->session->isLoggedIn();
    }

    /**
     * Get the last message that was set during a call to Auther::createUser or Auther::authUser.
     * Can be either an validation error message or a success message. The messages are
     * formatted in a way that is suitable for presenting in UI.
     */
    public function getMessage(): string
    {
        return $this->session->getMessage();
    }

    /**
     * Cleans up messages set during calls to Auther methods.
     * 
     * This method is ideally called att the end of the clients request 
     * in order to not delete messages before they have been sent to the client.
     */
    public function cleanUp()
    {
        if (!$this->session->willMessageSurviveReloadOnce()) {
            $this->session->resetMessages();
        }

        if (!$this->session->willUsernameSurviveReloadOnce()) {
            $this->session->resetLastEnteredUsername();
        }
    }
}
