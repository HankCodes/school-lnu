#ifndef HTTP_SERVER_H
#define HTTP_SERVER_H


#include <WString.h>

void server_send_init_request();
void server_start();
void server_listen();
String server_getSsid();
String server_getPassword();
bool server_hasCredentials();
bool server_isSensorRunning();

#endif
