// Variables for board's wifi
const char* boardSsid = "MD-1001_1";
const char* boardPassword = "12345678";
IPAddress local_ip(192, 168, 1, 3);
IPAddress gateway(192, 168, 1, 3);
IPAddress subnet(255, 255, 255, 0);

void setupSoftAP() {
  Serial.println("Setting up Soft Acess Point...");
  // connect to board wifi for receiving network wifi
  WiFi.softAP(boardSsid, boardPassword);
  // wait 500ms for completing softAP
  delay(500);
  WiFi.softAPConfig(local_ip, gateway, subnet);
  delay(1000);
}

void teardownSoftAP() {
  WiFi.softAPdisconnect();
  delay(1000);
  Serial.println("Access point is terminated");
}
