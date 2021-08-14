#ifndef SEND_HTTP_H
#define SEND_HTTP_H

#include <Arduino.h>
#include <WString.h>

class SendHttp {
    public:
        SendHttp(String url);
        void postInit(String ip);
        void alarmTriggered();
        void changeState(bool state);
    private:
        String url;
        void post(String url, String payloadToSend);
};

#endif
