<?php

namespace VoiceApp\View;

class Popup
{
    /**
     * Renders a popup that will sit on the top of the rest
     * of the content on the page
     * 
     * @return - HTML
     */
    public function renderHTML(string $html): string
    {
        return '
            <div class="popup_bg">
                <div class="popup_window">'
            . $html .
            '</div>
            </div>
        ';
    }
}
