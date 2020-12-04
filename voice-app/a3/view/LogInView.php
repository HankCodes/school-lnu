<?php

namespace VoiceApp\View;

class LogInView
{
    private $messageToDisplay = "";

    private static $login = 'LoginView::Login';
    private static $name = 'LoginView::UserName';
    private static $password = 'LoginView::Password';
    private static $keep = 'LoginView::KeepMeLoggedIn';
    private static $messageId = 'LoginView::Message';

    private $auther;

    public function __construct(\Auther\Auther $auther)
    {
        $this->auther = $auther;
    }

    public function setLastEnteredUsername(string $username): void
    {
        $this->lastEnteredUsername = $username;
    }

    public function setMessageToDisplay(string $message): void
    {
        $this->messageToDisplay = $message;
    }

    /**
     * Checks if a user is trying to log in to the application
     * 
     * @return - True if user is making a login attempt, false if not.
     */
    public function userMakesLoginAttempt(): bool
    {
        return isset($_POST[self::$login]);
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

    /**
     * Renders the HTML for the complete view.
     * 
     * @return - HTML
     */
    public function renderHTML(): string
    {
        return
            $this->generateWelcomeHTML() .
            '<div class="display_flex standard_margin_top">'
            . $this->generateExplanationBox()
            . $this->generateLoginFormHTML() .
            '</div>'
            . $this->generateCreateAccountLink();
    }

    private function generateLoginFormHTML(): string
    {
        return '
			<form method="post" class="standard_form"> 
                <legend>Login - enter Username and password</legend>
                <p class="error_message" id="' . self::$messageId . '">' . $this->messageToDisplay . '</p>
                
                <label class="standard_label" for="' . self::$name . '">Username :</label>
                <input class="standard_field" type="text" id="' . self::$name . '" name="' . self::$name . '" value="' . $this->auther->getLastEnteredUsername() . '" />

                <label class="standard_label" for="' . self::$password . '">Password :</label>
                <input class="standard_field" type="password" id="' . self::$password . '" name="' . self::$password . '" />

                <label  for="' . self::$keep . '">Keep me logged in  :</label>
                <input  type="checkbox" id="' . self::$keep . '" name="' . self::$keep . '" />
                
                <input class="standard_button" type="submit" name="' . self::$login . '" value="Log in" />
            </form>';
    }

    private function generateCreateAccountLink(): string
    {
        return '
            <div class="standard_margin_top center_text large_margin_top">
                <p>Don\'t have an account? sign up <a href="/a3/?register">HERE</a></p>
            </div>
        ';
    }

    private function generateWelcomeHTML(): string
    {
        return '
            <div>
                <div>
                    <h1>The voice app</h1>
                </div">
                <div class="carl_left_speech_right">'
            . $this->getWelcomecarl() .
            ' <div>'
            . $this->generateGreetingSpeechBubble() .
            '</div>
            </div>
            </div>
        ';
    }

    private function getWelcomecarl(): string
    {
        return '<img class="carl_size" src="public/pics/CarlTheBot.png" alt="old carl waving">';
    }

    private function generateGreetingSpeechBubble(): string
    {
        return '<div class="speech_bubble_right">
                <h2>Hello young fella!</h2> 
                <p>My name is Carlitos, but you can call me <b>Carl</b>! </br>
                I\'m so glad that you want to stop by, it is so lonely at home now a days, the pandemic and all... 
                I\'m a robot so I dont need to worry \'bout that kind of viruses so why don\'t you
                <b>authenticate yourself</b> and come inside to have a little chat with me.
                <br>
                <br>
                You have to use <b>Google Chrome</b> to be able to talk to me.</p>
            </div>';
    }

    private function generateExplanationBox(): string
    {
        return '
            <div class="paragraph_box">
                <p>This app can be controlled with your voice. Upon authentication you will be able to 
                speak to <b>Carlitos</b>. This is done via the browser. It means that you have to allow the browser permission to record audio.
                There will be a popup that ask for permission when you log in, press "Allow" to allow recording. 
                <b>You can turn on or off the permission to record audio any time by pressing the "i"-icon on the left of the addressbar</b>
                <br>
                <br>
                You have to use <b>Google Chrome</b> to be able to talk to Carlitos</p>
            </div>
        ';
    }
}
