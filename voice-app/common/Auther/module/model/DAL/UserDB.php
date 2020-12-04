<?php

namespace Auther\Model\DAL;

require_once(__DIR__ . "/../../assets/MessageConstants.php");
require_once(__DIR__ . "/../../assets/CustomErrors.php");

class UserDB
{
    private $db;

    public function __construct(\mysqli $db)
    {
        $this->db = $db;
    }

    public function saveUser(\Auther\Model\User $user): void
    {
        $username = $user->getusername();
        $password = $user->getPassword();
        $presistLogin = $user->getPresistLogin();

        $hashedPassword = $this->hashPassword($password);

        $query = "INSERT " . \Auther\Constants::$DATABASE_TABLE_USER . " (" .
            \Auther\Constants::$DATABASE_COL_USER_USERNAME . ", " .
            \Auther\Constants::$DATABASE_COL_USER_PASSWORD . ", " .
            \Auther\Constants::$DATABASE_COL_PRESISTLOGIN . ")
                    VALUES ('$username', '$hashedPassword', '$presistLogin')";

        try {
            $this->createUserTableIfNotExist();
            $this->sendQuerryToDatabase($query);
        } catch (\Exception $e) {
            $this->throwUserDBExceptionIfUserExist($e);
            throw new \Exception($e->getMessage());
        }
    }

    public function authenticateUser(\Auther\Model\User $user): void
    {
        try {
            $username = $user->getUsername();
            $password = $user->getPassword();

            $query = "SELECT * FROM " . \Auther\Constants::$DATABASE_TABLE_USER . " WHERE " .
                \Auther\Constants::$DATABASE_COL_USER_USERNAME .
                " LIKE '$username'";

            $result = $this->db->query($query);

            $this->validateUser($result, $password);
        } catch (\Auther\Exceptions\DatabaseException $e) {
            throw new \Auther\Exceptions\DatabaseException(\Auther\Constants::$WRONG_NAME_OR_PASSWORD);
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }

    private function validateUser($queryResult, $password): void
    {
        if (!is_bool($queryResult) && $queryResult->num_rows == 1) {
            $passwordFromDatabase = $this->getPasswordFromQueryResult($queryResult);
            $this->comparePasswords($password, $passwordFromDatabase);

            $queryResult->free();
        } else {
            throw new \Auther\Exceptions\DatabaseException(\Auther\Constants::$WRONG_NAME_OR_PASSWORD);
        }
    }

    private function hashPassword($password): string
    {
        return password_hash($password, PASSWORD_DEFAULT);
    }

    private function comparePasswords($password, $passwordToCompare)
    {
        if (!password_verify($password, $passwordToCompare)) {
            throw new \Auther\Exceptions\DatabaseException(\Auther\Constants::$PASSWORDS_DO_NOT_MATCH);
        }
    }

    private function getPasswordFromQueryResult(\mysqli_result $result): string
    {
        $row = $result->fetch_assoc();
        return $row[\Auther\Constants::$DATABASE_COL_USER_PASSWORD];
    }

    private function createUserTableIfNotExist(): void
    {

        $query = "CREATE TABLE IF NOT EXISTS " . \Auther\Constants::$DATABASE_TABLE_USER . " (" .
            \Auther\Constants::$DATABASE_COL_USER_USERNAME . " VARCHAR(255) NOT NULL UNIQUE, " .
            \Auther\Constants::$DATABASE_COL_USER_PASSWORD . " VARCHAR(255) NOT NULL, " .
            \Auther\Constants::$DATABASE_COL_PRESISTLOGIN . " BOOLEAN NOT NULL DEFAULT FALSE)";

        if ($this->db->query($query) === FALSE) {
            throw new \Exception(\Auther\Constants::$DATABASE_TABLE_FAILED_TO_CREATE . " '" .
                \Auther\Constants::$DATABASE_TABLE_USER . "' : " . $this->db->error);
        }
    }

    private function sendQuerryToDatabase($query): void
    {
        if ($this->db->query($query) === TRUE) {
            return;
        } else {
            throw new \Exception(\Auther\Constants::$DATABASE_QUERY_ERROR . ": " . $query . "<br>" . $this->db->error);
        }
    }

    private function throwUserDBExceptionIfUserExist($e): void
    {
        $isDuplicate = strpos($e->getMessage(), \Auther\Constants::$DATABASE_DUPLICATE_ENTRY);
        if ($isDuplicate) {
            throw new \Auther\Exceptions\DatabaseException(\Auther\Constants::$USER_ALREADY_EXIST);
        }
    }
}
