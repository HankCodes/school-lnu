<?php

namespace View;

class LoginView
{
	private $messageToDisplay = "";

	private static $login = 'LoginView::Login';
	private static $logout = 'LoginView::Logout';
	private static $name = 'LoginView::UserName';
	private static $password = 'LoginView::Password';
	private static $keep = 'LoginView::KeepMeLoggedIn';
	private static $messageId = 'LoginView::Message';

	private $auther;

	public function __construct(\Auther\Auther $auther)
	{
		$this->auther = $auther;
	}

	/**
	 * Renders the HTML from the current state of the view.
	 * 
	 * @return - HTML
	 */
	public function renderHTML(): string
	{
		if ($this->auther->isLoggedIn()) {
			return $this->generateLogoutButtonHTML();
		} else {
			return $this->generateLoginFormHTML();
		}
	}

	public function setLastEnteredUsername(string $username): void
	{
		$this->lastEnteredUsername = $username;
	}

	public function setMessageToDisplay(string $message): void
	{
		$this->messageToDisplay = $message;
	}

	public function userMakesLoginAttempt(): bool
	{
		return isset($_POST[self::$login]);
	}

	public function userMakesLogoutAttempt(): bool
	{
		return isset($_POST[self::$logout]);
	}

	public function getUsername(): string
	{
		return $_POST[self::$name];
	}

	public function getPassword(): string
	{
		return $_POST[self::$password];
	}
	public function getPresistLogIn(): bool
	{
		return isset($_POST[self::$keep]);
	}

	private function generateLogoutButtonHTML(): string
	{
		return '
			<form  method="post" >
				<p id="' . self::$messageId . '">' . $this->messageToDisplay . '</p>
				<input type="submit" name="' . self::$logout . '" value="logout"/>
			</form>
		';
	}

	private function generateLoginFormHTML(): string
	{
		return '
			<form method="post" > 
				<fieldset>
					<legend>Login - enter Username and password</legend>
					<p id="' . self::$messageId . '">' . $this->messageToDisplay . '</p>
					
					<label for="' . self::$name . '">Username :</label>
					<input type="text" id="' . self::$name . '" name="' . self::$name . '" value="' . $this->auther->getLastEnteredUsername() . '" />

					<label for="' . self::$password . '">Password :</label>
					<input type="password" id="' . self::$password . '" name="' . self::$password . '" />

					<label for="' . self::$keep . '">Keep me logged in  :</label>
					<input type="checkbox" id="' . self::$keep . '" name="' . self::$keep . '" />
					
					<input type="submit" name="' . self::$login . '" value="login" />
				</fieldset>
			</form>
		';
	}
}
