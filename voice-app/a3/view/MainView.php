<?php

namespace VoiceApp\View;

/**
 * This view is shown when the user is authenticated
 */
class MainView
{
    private static $LOG_OUT = "logout";
    private $redirect = false;


    public function setRedirect(bool $willRedirect): void
    {
        $this->willRediect = $willRedirect;
    }

    public function userMakesLogoutAttempt(): bool
    {
        return isset($_POST[self::$LOG_OUT]);
    }

    /**
     * Renders the HTML for the complete view or sets a redirect to the applications
     * root page if user wants to log out
     * 
     * @return - HTML or a redirect to the root url of the application
     */
    public function renderHTML(): string
    {
        if ($this->redirect) {
            header("Location: /a3/");
        }

        return '<div>'
            . $this->generateLogOutButton() .
            '<h1>VoiceApp</h1>'
            . $this->generateCarlAndSpeechBubble() .
            '<div>'
            . $this->generateCommadsSpecs() .
            '</div>
            </div>';
    }

    private function generateLogOutButton(): string
    {
        return '<form  method="post" class="log_out_form">
                    <input class="standard_button" type="submit" name="' . self::$LOG_OUT . '" value="logout"/>
                </form>';
    }

    private function generateCarlAndSpeechBubble(): string
    {
        return '<div class="carl_left_speech_right">
                <div>'
            . $this->generateLeftSpeechBubble() .
            '</div>'
            . $this->getCarlAwaits() .
            '</div>';
    }

    private function generateLeftSpeechBubble(): string
    {
        return '
            <div class="speech_bubble_left">
                <h2>Welcome in!</h2>
                <p>We can now talk to each other, how wonderful. If you want me to do something for you please just
                say <b>Hey Carl!</b> and I will listen. 
                <br>
                <br>
                Why don\'t you try out by saying the phrase
                <br> 
                <b>"Hey carl! Change to dark theme"</b></p>
                <br>
                Please bare in mind that I\'m a robot and dont understand humans that well. Speak loud and clear 
                and don\'t hesitate to repeat yourself. And oh, don\'t forget that your have to use <b>Google Chrome</b> to make it work.
            </div>
        ';
    }

    private function getCarlAwaits(): string
    {
        return '<img class="carl_size" src="public/pics/CarlTheBot2.png" alt="old carl waiting">';
    }

    private function generateCommadsSpecs(): string
    {
        return '
            <div class="collapsable_wrapper" id="collapsable">
                <div class="collapsable_bar">
                    <p>Valid commands to say to Apolita: </p>    
                </div>
                <div class="collapsable_content" id="collapsable_content">
                    <ul>
                        <li>Change background color to <i>*color of your choice*</i></li>
                        <li>Change text color to <i>*color of your choice*</i></li>
                        <li>Change to dark theme</i></li>
                        <li>Change to light theme</i></li>
                        <li>Log out</li>
                    </ul>
                </div>
            </div>
        ';
    }

    /**
     * Generates a form to send query message through text rather than speech.
     * This is kept for development reasons and will not be used in production.
     * 
     * @return - HTML
     */
    private function mockGetform(): string
    {
        return '<form action="/a3/?command" method="GET">
                <input type="text" name="verb" >
                <input type="text" name="target" >
                <input type="text" name="attribute" >
                <input type="text" name="value" >
                <input type="submit" name="command" value="send" >
            </form>';
    }
}
