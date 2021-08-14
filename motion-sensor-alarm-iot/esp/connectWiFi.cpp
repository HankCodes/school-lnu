#include <WiFi.h>
#include <String.h>

String ip;

void connectWiFi_init(String ssid, String password) {
  	delay(10);
  	Serial.println(ssid);
  	Serial.println(password);
  	
	int str_len1 = ssid.length() + 1;
  	int str_len2 = password.length() + 1;

  	char char_array1[str_len1];
  	char char_array2[str_len2];

  	ssid.toCharArray(char_array1, str_len1);
  	password.toCharArray(char_array2, str_len2);
  	WiFi.begin(char_array1, char_array2);
  
  	while (WiFi.status() != WL_CONNECTED) {
 		    digitalWrite(17, HIGH);
    		delay(500);
    		digitalWrite(17, LOW);
	    	delay(500);
    		Serial.println("Connecting to WiFi..");
	}
  
  	Serial.println("wifi connected");
  	Serial.println(WiFi.localIP());
}

String connectWiFi_getIp() {
	IPAddress ipAddress = WiFi.localIP();
	// Codesnippet from https://forum.arduino.cc/index.php?topic=228884.0#5
	return String(ipAddress[0]) + String(".") +\
	String(ipAddress[1]) + String(".") +\
	String(ipAddress[2]) + String(".") +\
	String(ipAddress[3]) ;
}