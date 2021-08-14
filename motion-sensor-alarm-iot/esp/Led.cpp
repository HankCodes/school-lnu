#include "Led.h"  

Led::Led(uint8_t pin)
{
    this->pin = pin;

    pinMode(pin, OUTPUT);
}

void Led::on()
{
    digitalWrite(this->pin, HIGH);
}

void Led::off()
{
    digitalWrite(this->pin, LOW);
}