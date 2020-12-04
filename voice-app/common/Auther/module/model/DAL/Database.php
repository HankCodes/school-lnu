<?php

namespace Auther\Model\DAL;

require_once(__DIR__ . "/../../assets/MessageConstants.php");

class Database
{
    private $username;
    private $password;
    private $database;
    private $hostname;
    private $port = 3306;

    public function __construct($settings)
    {
        $this->setConnectionDataFromEnvVariables($settings);
    }

    public function connect(): \mysqli
    {
        $conn = mysqli_init();
        $success = mysqli_real_connect(
            $conn,
            $this->hostname,
            $this->username,
            $this->password,
            $this->database,
            $this->port,
        );

        if (!$success) {
            throw new \Exception(\Auther\Constants::$DATABASE_CONNECTION_DENIED . ": " . $conn->connect_error);
        }

        return $conn;
    }

    private function setConnectionDataFromEnvVariables(\stdClass $settings): void
    {
        $this->username = getenv($settings->db_username_env);
        $this->password = getenv($settings->db_password_env);
        $this->database = getenv($settings->db_name_env);
        $this->hostname = getenv($settings->db_host_env);
        $this->port = getenv($settings->db_port_env);
    }
}
