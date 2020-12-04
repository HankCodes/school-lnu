<?php

namespace View;

class RegisterUser
{
	private $messageToDisplay = "";
	private $lastEnteredUsername = "";
	private $redirect = false;

	private static $message = "RegisterView::Message";
	private static $name = "RegisterView::UserName";
	private static $password = "RegisterView::Password";
	private static $passwordRepeat = "RegisterView::PasswordRepeat";
	private static $doRegistration = "RegisterView::Register";
	private static $get_register = "register";
	private static $redirect_header = "Location: /a2/index.php";


	/**
	 * Checks if the user is requesting the page for register a new account.
	 * 
	 * @return - True if user is requesting the register page, false if not.
	 */
	public function isActive(): bool
	{
		return isset($_GET[self::$get_register]);
	}

	/**
	 * Checks if the user is making an attempt of creating a new account.
	 * 
	 * @return - True if user requesting a new account, false if not
	 */
	public function userRegistrationAttempt(): bool
	{
		return isset($_POST[self::$doRegistration]);
	}

	public function getUsername(): string
	{
		if (!isset($_POST[self::$name])) {
			return "";
		}
		return  $_POST[self::$name];
	}

	public function getPassword(): string
	{
		if (!isset($_POST[self::$password])) {
			return "";
		}
		return $_POST[self::$password];
	}

	public function getPasswordRepeat(): string
	{
		if (!isset($_POST[self::$passwordRepeat])) {
			return "";
		}
		return $_POST[self::$passwordRepeat];
	}

	public function setMessageToDisplay(string $message)
	{
		$this->messageToDisplay = $message;
	}

	public function setLastEnteredUsername(string $username)
	{
		$this->lastEnteredUsername = $username;
	}

	public function setRedirect(bool $willRedirect)
	{
		$this->redirect = $willRedirect;
	}

	/**
	 * Renders the whole output for the view or redirects to
	 * log in page if user was successfully registered.
	 * 
	 * @return - The whole content of the view in its current state or a redirect to log in page if
	 * user registered an account successfully.
	 */
	public function renderHTML(): string
	{
		if ($this->redirect) {
			header(self::$redirect_header);
		}

		return $this->generateRegistrationForm();
	}

	private function generateRegistrationForm(): string
	{
		return '<form action="?register" method="post" enctype="multipart/form-data">
				<fieldset>
				<legend>Register a new user - Write username and password</legend>
					<p id="' . self::$message . '">' . $this->messageToDisplay . '</p>
					<label for="' . self::$name . '">Username :</label>
					<input type="text" size="20" name="' . self::$name . '" id="' . self::$name . '" value="' . $this->lastEnteredUsername . '" />
					<br>
					<label for="' . self::$password . '">Password  :</label>
					<input type="password" size="20" name="' . self::$password . '" id="' . self::$password . '" />
					<br>
					<label for="' . self::$passwordRepeat . '">Repeat password  :</label>
					<input type="password" size="20" name="' . self::$passwordRepeat . '" id="' . self::$passwordRepeat . '" />
					<br>
					<input id="' . self::$doRegistration . '" type="submit" name="' . self::$doRegistration . '" value="Register">
					<br>
				</fieldset>
		</form>';
	}
}
