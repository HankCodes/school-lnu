<?php

namespace VoiceApp\View;

class LayoutView
{

  /**
   * Renders the appication state as HTML
   * 
   * @return - Void but writes to the outpu buffer.
   */
  public function renderHTML(
    bool $isAuthed,
    \VoiceApp\View\LogInView $loginView,
    \VoiceApp\View\RegisterView $regView,
    \VoiceApp\View\StyleView $styleView,
    \VoiceApp\View\MainView $mainView,
    \VoiceApp\View\Popup $popup
  ): void {
    $renderStyle = "";
    if ($isAuthed) {
      $renderStyle = $styleView->renderStyles();
    }

    echo '<!DOCTYPE html>
      <html>
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Voice App</title>
        <link href="https://fonts.googleapis.com/css2?family=Quicksand&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="public/main.css">'
      . $renderStyle .
      '
      </head>
        <body>
        
        <div class="container background">'
      . $this->loadHTML($isAuthed, $loginView, $regView, $mainView, $popup) .
      '</div>
      <script src="public/main.js"></script>'
      . $this->loadSpeechScript($isAuthed) .
      '</body>
      </html>
    ';
  }

  private function loadHTML(
    bool $isAuthed,
    \VoiceApp\View\LogInView $loginView,
    \VoiceApp\View\RegisterView $regView,
    \VoiceApp\View\MainView $mainView,
    \VoiceApp\View\Popup $popup
  ): string {
    if ($regView->isActive() && !$isAuthed) {
      return $loginView->renderHTML() . $popup->renderHTML($regView->renderHTML());
    } else if (!$isAuthed) {
      return $loginView->renderHTML();
    } else {
      return $mainView->renderHTML();
    }
  }

  private function loadSpeechScript(bool $isAuthed): string
  {
    if (!$isAuthed) {
      return "";
    }

    return '<script type="module" src="public/voice.js"></script>';
  }
}
