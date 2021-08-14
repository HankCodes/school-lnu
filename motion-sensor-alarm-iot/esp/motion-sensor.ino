#include "connectWiFi.h" 
#include <Preferences.h>
#include <HTTPClient.h>
#include "http_server.h"
#include "Led.h"
#include "SendHttp.h"

// Initialize flash storage preference object
Preferences preferences;
WiFiClient espClient;

Led led_green = Led(17);
Led led_red = Led(16);

SendHttp http("http://192.168.43.219:8000");

String currentIp; 
const int PIR_PIN = 26;
int pirState = 0;
int motionDetected = 0;
bool isSensorRunning = false;
bool currentSesnsorState;
String ssid;
String password;


void setup() {
  Serial.begin(115200);
  pinMode(PIR_PIN, INPUT);
  
  preferences.begin("md-1001", false);
  ssid = preferences.getString("ssid", "");
  password = preferences.getString("password", "");
  
  if (ssid.length() < 1) {
    Serial.println("No wifi credentials, setting up SAP..");
    setupSoftAP(); 
    server_start();
        led_green.on();
        delay(50);
        led_green.off();
        delay(50);
        led_green.on();
        delay(50);
        led_green.off();
        delay(50);
        
    while (!server_hasCredentials()) {
        server_listen();

    }
    
    preferences.putString("ssid", server_getSsid());
    preferences.putString("password", server_getPassword());
    ssid = server_getSsid();
    password = server_getPassword();
    
    teardownSoftAP();
  }
  
  Serial.println("conencting to local wifi");
  connectWiFi_init("Henkos", "12345678");
  
  // Close the preferences object when done
  preferences.end();

  server_start();
  currentIp = connectWiFi_getIp();
  http.postInit(currentIp);
}

void loop() {
  server_listen();
  isSensorRunning = server_isSensorRunning();

  if (currentSesnsorState != isSensorRunning) {
    currentSesnsorState = isSensorRunning;
    http.changeState(currentSesnsorState);
  }

  if (isSensorRunning) {
    run_sensor();  
  } else {
   led_red.off();
  }
}


void run_sensor() {
  motionDetected = digitalRead(PIR_PIN);
  if (motionDetected == HIGH) {            
    if (pirState == LOW) {
      led_red.on();
      Serial.println("Motion detected! Send HTTP request");
      http.alarmTriggered();
      pirState = HIGH;
    }
  } else {
    led_red.off();
    if (pirState == HIGH){
      Serial.println("Motion ended!, Dont send request");
      pirState = LOW;
    }
  }
}
