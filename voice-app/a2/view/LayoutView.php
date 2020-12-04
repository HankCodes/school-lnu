<?php

namespace View;

class LayoutView
{

  /**
   * Gathers the content to render from the views.
   * 
   * @return - Void but writes to output buffer.
   */
  public function render($isLoggedIn, \View\LoginView $loginView, \View\RegisterUser $regUserView, DateTimeView $dtv, $auth): void
  {
    echo '<!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Login Example</title>
        </head>
        <body>
          <h1>Assignment 2</h1>'
      . $this->renderLinkAndAuthStatus($isLoggedIn, $regUserView)  .
      '<div class="container">
              ' . $this->viewToRender($loginView, $regUserView) . '
            
              ' . $dtv->show() . '
          </div>
         </body>
      </html>
    ';
  }

  private function viewToRender($loginView, $regUserView): string
  {
    if ($regUserView->isActive()) {
      return $regUserView->renderHTML();
    } else {
      return $loginView->renderHTML();
    }
  }

  private function renderLinkAndAuthStatus(bool $isLoggedIn, \View\RegisterUser $regUserView): string
  {
    return $this->renderLink($isLoggedIn, $regUserView) . $this->renderIsLoggedIn($isLoggedIn);
  }

  private function renderLink(bool $isLoggedIn, \View\RegisterUser $regUserView): string
  {
    $link = "";

    if ($regUserView->isActive()) {
      $link = "<a href='/a2' >Back to login</a>";
    } else if (!$isLoggedIn) {
      $link = "<a href='?register' >Register a new user</a>";
    }

    return $link;
  }

  private function renderIsLoggedIn(bool $isLoggedIn): string
  {
    if ($isLoggedIn) {
      return '<h2>Logged in</h2>';
    } else {
      return '<h2>Not logged in</h2>';
    }
  }
}
