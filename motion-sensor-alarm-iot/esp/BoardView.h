#ifndef BOARD_VIEW_H;
#define BOARD_VIEW_H;

#include <Arduino.h>

class BoardView
{
    private:
    String formatHTML(String style, String body, String script);
    String getStyle();
    String getBody();
    String getScript();

    String getNumpadStyle();
    String getNumpadBody();
    String getNumpadScript();

    public:
    String getView();
    String getNumpadView();
};

#endif