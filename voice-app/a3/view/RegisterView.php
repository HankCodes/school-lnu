<?php

namespace VoiceApp\View;

class RegisterView
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

	/**
	 * Checks if the user is located on the page for creating an account.
	 * 
	 * @return - True if the user is on the create account page, false if not.
	 */
	public function isActive(): bool
	{
		return isset($_GET[self::$get_register]);
	}

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

	public function setMessageToDisplay(string $message): void
	{
		$this->messageToDisplay = $message;
	}

	public function setLastEnteredUsername(string $username): void
	{
		$this->lastEnteredUsername = $username;
	}

	public function setRedirect(bool $willRedirect): void
	{
		$this->redirect = $willRedirect;
	}

	/**
	 * Renders the HTML for the complete view or sets a redirect to the applications
	 * root page if registering a user is successful
	 * 
	 * @return - view HTML or a redirect to the root url of the application
	 */
	public function renderHTML(): string
	{
		if ($this->redirect) {
			header("Location: /a3/");
		}

		return $this->generateRegistrationForm();
	}

	private function generateRegistrationForm(): string
	{
		return '<form action="/a3/?register" method="post" enctype="multipart/form-data" class="standard_form">
			<legend>Register account - Write username and password</legend>
				<p class="error_message" id="' . self::$message . '">' . $this->messageToDisplay . '</p>
				<label class="standard_label" for="' . self::$name . '">Username :</label>
				<input class="standard_field" type="text" size="20" name="' . self::$name . '" id="' . self::$name . '" value="' . $this->lastEnteredUsername . '" />

				<label class="standard_label" for="' . self::$password . '">Password  :</label>
				<input class="standard_field" type="password" size="20" name="' . self::$password . '" id="' . self::$password . '" />
	
				<label class="standard_label" for="' . self::$passwordRepeat . '">Repeat password  :</label>
				<input class="standard_field" type="password" size="20" name="' . self::$passwordRepeat . '" id="' . self::$passwordRepeat . '" />
		
				<input class="standard_button" id="' . self::$doRegistration . '" type="submit" name="' . self::$doRegistration . '" value="Register" />
				<a class="close_button standard_margin_top" href="/a3/index.php"> Close</a>
		</form>';
	}
}
