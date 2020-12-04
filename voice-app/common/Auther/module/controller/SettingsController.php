<?php

namespace Auther\Controller;

require_once(__DIR__ . "../../assets/CustomErrors.php");
require_once(__DIR__ . "../../assets/SettingsMessages.php");

/**
 * Controller for handling the settings file.
 */
class SettingsController
{
    private $settings;

    public function __construct(string $pathToSettings)
    {
        $this->throwIfFileNotFound($pathToSettings);

        $settings = $this->readJsonFromPath($pathToSettings);
        $this->settings = $this->validateJsonContent($settings);
    }

    public function getSettings(): \stdClass
    {
        return $this->settings;
    }

    private function throwIfFileNotFound(string $path): void
    {
        if (!file_exists($path)) {
            throw new \Auther\Exceptions\SettingsException(\Auther\messages\SettingsMessages::$SETTINGS_NOT_FOUND);
        }
    }
    private function readJsonFromPath(string $path): \stdClass
    {
        $string = file_get_contents($path);
        return json_decode($string);
    }

    private function validateJsonContent(\stdClass $json): \stdClass
    {
        $errorMessage = array();

        if (!property_exists($json, \Auther\messages\SettingsMessages::$APP_NAME)) {
            $errorMessage[] = \Auther\messages\SettingsMessages::$APP_NAME_MISSING;
        }

        if (!property_exists($json, \Auther\messages\SettingsMessages::$ERROR_LOG)) {
            $errorMessage[] = \Auther\messages\SettingsMessages::$ERROR_LOG_MISSING;
        }

        if (!file_exists($json->error_log)) {
            $errorMessage[] = \Auther\messages\SettingsMessages::$ERROR_LOG_NOT_FOUND;
        }

        if (!property_exists($json, \Auther\messages\SettingsMessages::$DB_NAME)) {
            $errorMessage[] = \Auther\messages\SettingsMessages::$DB_NAME_MISSING;
        }

        if (!property_exists($json, \Auther\messages\SettingsMessages::$DB_USERNAME)) {
            $errorMessage[] = \Auther\messages\SettingsMessages::$DB_USERNAME_MISSING;
        }

        if (!property_exists($json, \Auther\messages\SettingsMessages::$DB_PASSWORD)) {
            $errorMessage[] = \Auther\messages\SettingsMessages::$DB_PASSWORD_MISSING;
        }

        if (!property_exists($json, \Auther\messages\SettingsMessages::$DB_HOST)) {
            $errorMessage[] = \Auther\messages\SettingsMessages::$DB_HOST_MISSING;
        }

        if (!property_exists($json, \Auther\messages\SettingsMessages::$DB_PORT)) {
            $json->db_port_env = 3306;
        }

        if (!property_exists($json, \Auther\messages\SettingsMessages::$TERMINATE_ON_ERROR)) {
            $json->terminate_on_db_error = true;
        }

        if (count($errorMessage) > 0) {
            throw new \Auther\Exceptions\SettingsException(implode(", ", $errorMessage));
        }

        return $json;
    }
}
