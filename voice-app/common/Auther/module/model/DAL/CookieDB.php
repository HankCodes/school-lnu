<?php

namespace Auther\Model\DAL;

require_once(__DIR__ . "/../../assets/MessageConstants.php");

class CookieDB
{
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    public function authenticateUser($username, $cookiePassword): void
    {
        $query = "SELECT * FROM " . \Auther\Constants::$DATABASE_TABLE_COOKIE . " WHERE " .
            \Auther\Constants::$DATABASE_COL_COOKIE_PASSWORD . " LIKE '$cookiePassword'";

        $result = $this->db->query($query);
        $this->checkCookieValidity($result, $username);
    }

    public function saveCookie($username, $cookiePassword): void
    {
        $date = new \DateTime(\Auther\Constants::$COOKIE_EXP_TIME);
        $expdate = $date->format(\Auther\Constants::$COOKIE_DATE_FORMAT);

        $query = "INSERT " . \Auther\Constants::$DATABASE_TABLE_COOKIE . "(" .
            \Auther\Constants::$DATABASE_COL_COOKIE_USERNAME . ", " .
            \Auther\Constants::$DATABASE_COL_COOKIE_PASSWORD . ", " .
            \Auther\Constants::$DATABASE_COL_COOKIE_EXPDATE . ")
        VALUES ('$username', '$cookiePassword', '$expdate')
        ON DUPLICATE KEY UPDATE " .
            \Auther\Constants::$DATABASE_COL_COOKIE_PASSWORD . " = '$cookiePassword', " .
            \Auther\Constants::$DATABASE_COL_COOKIE_EXPDATE . " = '$expdate'";

        try {
            $this->createCookieTableIfNotExist();
            $this->sendQuerryToDatabase($query);
        } catch (\Exception $e) {
            throw new \Exception(\Auther\Constants::$COOKIE_NOT_CREATED);
        }
    }

    private function createCookieTableIfNotExist()
    {
        $query = "CREATE TABLE IF NOT EXISTS " . \Auther\Constants::$DATABASE_TABLE_COOKIE . " (" .
            \Auther\Constants::$DATABASE_COL_COOKIE_USERNAME . " VARCHAR(255) NOT NULL UNIQUE, " .
            \Auther\Constants::$DATABASE_COL_COOKIE_PASSWORD . " VARCHAR(255) NOT NULL, " .
            \Auther\Constants::$DATABASE_COL_COOKIE_EXPDATE . " DATETIME NOT NULL)";

        if ($this->db->query($query) === TRUE) {
            return;
        } else {
            throw new \Exception(\Auther\Constants::$DATABASE_TABLE_FAILED_TO_CREATE . ": "
                . \Auther\Constants::$DATABASE_TABLE_COOKIE . " " .
                $this->db->error);
        }
    }

    private function sendQuerryToDatabase($query)
    {
        if ($this->db->query($query) === TRUE) {
            return;
        } else {
            throw new \Exception(\Auther\Constants::$DATABASE_QUERY_ERROR .
                $query . "<br>" . $this->db->error);
        }
    }

    private function checkCookieValidity($queryResult, $username): void
    {
        if (!is_bool($queryResult) && $queryResult->num_rows == 1) {
            $row = $queryResult->fetch_assoc();
            $this->throwIfExpiredCookie($row[\Auther\Constants::$DATABASE_COL_COOKIE_EXPDATE]);
            $this->throwIfNotEqual($username, $row[\Auther\Constants::$DATABASE_COL_COOKIE_USERNAME]);
            $queryResult->free();
        } else {
            throw new \Exception(\Auther\Constants::$COOKIE_NOT_FOUND);
        }
    }

    private function throwIfExpiredCookie(string $expDate): void
    {
        if (new \DateTime() > new \DateTime($expDate)) {
            throw new \Exception(\Auther\Constants::$COOKIE_EXPIRED);
        }
    }

    private function throwIfNotEqual(string $username, string $cookieUsername): void
    {
        if ($username != $cookieUsername) {
            throw new \Exception(\Auther\Constants::$USERNAMES_NOT_MATCH);
        }
    }
}
