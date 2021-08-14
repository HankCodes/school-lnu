#ifndef CONNECT_WIFI_H
#define CONNECT_WIFI_H

#include <WString.h>

void connectWiFi_init(String ssid, String password);
String connectWiFi_getIp();
#endif
