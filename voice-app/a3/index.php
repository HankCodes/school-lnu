<?php

session_start();
require_once("Application/VoiceApp.php");

if ($_SERVER['SERVER_NAME'] == 'localhost') {
    // set local env variables for database connection. 
    // These variables are required for Auther to work.
    putenv("db_host=localhost");
    putenv("db_username=root");
    putenv("db_password=root");
    putenv("db_port=3306");
    putenv("db_database=users");
}

$app = new \VoiceApp\VoiceApp();
$app->run();
