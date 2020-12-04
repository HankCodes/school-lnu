<?php

namespace VoiceApp\View;

class ErrorLogger
{
    private $path;

    private $dateFormat = "Y-m-d H:i:s";

    public function __construct(string $path)
    {
        $this->path = $path;
    }

    public function writeToLog(string $message): void
    {
        error_log($this->formatLogMessage($message), 3, $this->path);
    }

    private function formatLogMessage(string $message): string
    {
        $date = date($this->dateFormat);

        return "\n\n*******************\n" .
            $date . "\n" .
            $message .
            "\n*******************\n";
    }
}
