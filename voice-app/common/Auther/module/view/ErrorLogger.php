<?php

namespace Auther\View;

class ErrorLogger
{
    private $path_to_error_log;
    private $dateFormat = "Y-m-d H:i:s";

    public function __construct(string $path)
    {
        $this->path_to_error_log = $path;
    }

    public function writeToLog(\exception $e)
    {
        error_log($this->renderMessage($e), 3, $this->path_to_error_log);
    }

    private function renderMessage(\Exception $e): string
    {
        return $this->renderErrorHeader() . $e . $this->renderErrorEnd();
    }

    private function renderErrorHeader(): string
    {
        return "\n\n============== " .  date($this->dateFormat) . "==============\n";
    }

    private function renderErrorEnd(): string
    {
        return "\n=============== END OF MESSAGE ===============\n";
    }
}
