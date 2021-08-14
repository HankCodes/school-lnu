#include "BoardView.h";

String BoardView::formatHTML(String style, String body, String script)
{
    String html =
    "<!DOCTYPE html>" 
    "<html>"
    "<head>"
        "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, user-scalable=no\">"
        "<title>MD-1001-1</title>" + 
        style +
    "<head>" +
        body +
        script +
    "</html>"; 

    return html;
}

String BoardView::getStyle()
{
    return "<style>" 
        "html { font-family: Helvetica; display: inline-block; margin: 0px auto; text-align: center;}"
        "body{margin-top: 50px;} h1 {color: #444444;margin: 50px auto 30px;} h3 {color: #444444;margin-bottom: 50px;}"
        ".button {display: block;width: 80px;background-color: #3498db;border: none;color: white;padding: 13px 30px;text-decoration: none;font-size: 25px;margin: 0px auto 35px;cursor: pointer;border-radius: 4px;}"
        ".button-on {background-color: #3498db;}"
        ".button-on:active {background-color: #2980b9;}"
        ".button-off {background-color: #34495e;}"
        ".button-off:active {background-color: #2c3e50;}"
        "p {font-size: 14px;color: #888;margin-bottom: 10px;}"
      "</style>";
}

String BoardView::getBody()
{
    return "<body>"
      "<h1>Set up WIfi</h1>"
      "<h3>Enter your Wifi credentials</h3>"
      "<form action=\"/post\" method=\"POST\">"
        "<input type=\"text\" name=\"ssid\" placeholder\"Enter wifi name\">"
        "<input type=\"password\" name=\"password\" >"
        "<input type=\"submit\" value=\"Send\">"
    "</form>"
  "</body>";
}

String BoardView::getScript()
{
    return "<script></script>";
} 

String BoardView::getNumpadStyle()
{
    return "<style>"
"* {"
  "margin: 0;"
  "padding: 0;"
  "box-sizing: border-box;"
  "font-family: sans-serif;"
  "font-weight: 600;"
  "font-size: 20px;"
"}"
"main {"
  "display: flex;"
  "flex-direction: column;"
  "justify-content: center;"
  "align-items: center;"
"}"
"#state {"
  "margin: 10px;"
"}"
"#form {"
    "width: 300px;"
    "background-color: #f9faff;"
    "border: 1px solid #dbe4fd;"
"}"
"input {"
    "height: 70px;"
    "width: 100%;"
    "border: 1px solid #dbe4fd;"
    "text-align: right;"
    "font-size: 40px;"
    "color: #373e50;"
"}"
".numpad {"
    "margin: 0 auto;"
    "width: 300px;"
    "height: 300px;"
    "display: flex;"
    "flex-wrap: wrap;"
"}"
".number {"
    "width: 100px;"
    "height: 100px;"
    "border: 1px solid #d2defd;"
    "display: flex;"
    "justify-content: center;"
    "align-items: center; "
  "}"
  ".number p {"
    "color: #373e50;"
    "font-size: 40px;"
  "}"
  "#activate, #deactivate {"
    "height: 50px;"
    "width: 50%;"
    "font-weight: 700;"
    "color: white;"
    "font-size: 20px;"
  "}"
  "#activate {"
    "border: 1px solid green;"
    "background-color: #89b789;"
  "}"
  "#deactivate {"
    "border: 1px solid red;"
    "background-color: #de9595;"
  "}"
  "</style>";
}

String BoardView::getNumpadBody()
{
    return "<body>"
    "<main>"
      "<div>"
        "<p id=\"state\">...</p>"
      "</div>"
  "<div id=\"form\">"
    "<input type=\"text\" >"
    "<div class=\"numpad\">"
    "</div>"
    "<div class=\"btn-wrapper<\">"
      "<button id=\"activate\">"
        "Activate"
      "</button>"
      "<button id=\"deactivate\">"
        "deactivate"
      "</button>"
    "</div>"
  "</div>"
"</main>"
"</body>";
}

String BoardView::getNumpadScript()
{
    return "<script>"
        "const numpad = document.querySelector('.numpad');"
        "for (i = 1; i <= 9; i++) {"
            "const div = document.createElement('div');"
            "div.classList.add('number');"
            "const p = document.createElement('p');"
            "p.textContent = i;"
            "div.appendChild(p);"
            "numpad.appendChild(div);"
        "}"
        "const input = document.querySelector('input');"
        "const activate = document.querySelector('#activate');"
        "const deactivate = document.querySelector('#deactivate');"
        "const state = document.querySelector('#state');"
        "const send = async (url) => {"
            "const { on } = await ( await fetch(url, { method: 'post' })).json();" 
            "state.textContent = on ? 'Activated' : 'Deactivated';"
        "};"
        " "
        "numpad.addEventListener('click', (e) => {"
        "    input.value += e.target.textContent" 
        "});"
        "activate.addEventListener('click', () => send('/sensor/motion/actions/activate'));"
        "deactivate.addEventListener('click', () => send('/sensor/motion/actions/deactivate'));"
        "</script>";
}

String BoardView::getView()
{
    String style = getStyle();
    String body = getBody();
    String script = getScript();
    return formatHTML(style, body, script);
}

String BoardView::getNumpadView()
{
    String style = getNumpadStyle();
    String body = getNumpadBody();
    String script = getNumpadScript();
    return formatHTML(style, body, script);
}