#include "boardHTML.h"
#include <String.h>
#include <WebServer.h>
#include <HTTPClient.h>
#include "BoardView.h"

String wifiSsid = "";
String wifiPassword = "";
bool hasWifiCreds;
bool isSensorOn = false;
BoardView boardView; 

WebServer server(80);

String getJsonState() {
	String state = isSensorOn ? "true" : "false";
	String s = "{ \"on\": " + state + " }";
	return s;
}

void AP_index() {
	Serial.println("Client connected");
	server.send(200, "text/html", boardView.getView());
}

void AP_post() {
	Serial.println("Recieved Wifi credentials");
	wifiSsid = server.arg("ssid");
	wifiPassword = server.arg("password");

	delay(500);

	server.send(200, "text/plain", "OK");
	hasWifiCreds = true;
}
void start_sensor() {
	Serial.println("Start motion sensor");
	isSensorOn = true;
	server.send(200, "application/json", getJsonState());
}

void stop_sensor() {
	Serial.println("Stopping motion sensor");
	isSensorOn = false; 
	server.send(200, "application/json", getJsonState());
}

void send_sensor_state() {
	Serial.println("Sending state");
	server.send(200, "application/json", getJsonState());
}

void get_app() {
	Serial.println("Sending app to client");
	server.send(200, "text/html", boardView.getNumpadView());
}

void server_start() {
	Serial.println("Starting Server");

	server.on("/", AP_index);
	server.on("/post", HTTP_POST, AP_post); 
	server.on("/app", get_app);
	server.on("/sensor/motion/actions/activate", HTTP_POST, start_sensor);
	server.on("/sensor/motion/actions/deactivate", HTTP_POST, stop_sensor);
	server.on("/sensor/motion/properties/on", send_sensor_state);
	
	server.begin();
}

void server_listen() {
	server.handleClient();
}

bool server_isSensorRunning() {
	return isSensorOn;
}

String server_getSsid() {
	return wifiSsid;
}

String server_getPassword() {
	return wifiPassword; 
}

bool server_hasCredentials() {
	return hasWifiCreds;
}
