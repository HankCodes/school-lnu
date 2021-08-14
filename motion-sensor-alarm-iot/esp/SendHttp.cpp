#include <HTTPClient.h>
#include <Arduino.h>
#include "SendHttp.h"

String url;

SendHttp::SendHttp(String url)
    : url(url) {}

void SendHttp::post(String url, String payloadToSend)
{
	HTTPClient http;

	http.begin(url);
	Serial.println("Url sent to Cloud-server");
	Serial.println(url);
  
    http.addHeader("Content-Type", "application/json");
	int httpResponseCode = http.POST(payloadToSend);

	String payload = "{}"; 

	if (httpResponseCode>0) {
		Serial.print("HTTP Response code: ");
		Serial.println(httpResponseCode);
		payload = http.getString();
	} else {
		Serial.print("Error code: ");
		Serial.println(httpResponseCode);
	}

	http.end();
	Serial.println("Respons from server:");
	Serial.println(payload);
}

void SendHttp::postInit(String ip)
{
	String deviceProperties = "{ \"ip\": \"" + ip + "\", \"port\":\"80\", \"id\": \"md-1001_1\" }";
    post(url + "/device/init", deviceProperties);
}

void SendHttp::alarmTriggered()
{
    Serial.println("Alarm triggered, sending request");
	String deviceProperties = "{ \"id\": \"md-1001_1\" }";
    post(url + "/device/triggered", deviceProperties);
}

void SendHttp::changeState(bool state)
{
    Serial.println("State changed, sending request");
	String stateAsString = state ? "true" : "false";
	String deviceProperties = "{ \"id\": \"md-1001_1\", \"state\":" + stateAsString + " }";
    post(url + "/device/state", deviceProperties);
}