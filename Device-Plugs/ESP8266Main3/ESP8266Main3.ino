/*
 * 09/08/2019
 * Makerspace IoT Project
 * ESP8266Server4.ino
 * 
 * This file runs the main code for the ESP8266 NodeMCU microcontroller
 * in the the Makerspace IoT project.
 * 
 */

#include "ESP8266Main.h"
#include <ESP8266WebServer.h>

extern ESP8266WebServer server;

const char* init_ssid = "IdeasLab";
const char* init_password = "Friday!23";
const char* init_masterIP = "192.168.0.110";

const char* APssid = "Plug - ";
const char* APpassword = "esp";

int relay_pin = 12;
int builtin_LED_pin = 13;
int timeoutThreshold = 30;

GPIO* gpio;
Config* cfg;
Network* net;
ESP_RequestHandler* reqHandle;
ESP_RequestSender* reqSend;
Utilities* util;

void setup() {

  Serial.begin(115200);
  
  gpio = new GPIO();
  cfg = new Config();
  net = new Network();
  reqHandle = new ESP_RequestHandler();
  reqSend = new ESP_RequestSender();
  util = new Utilities();

  cfg->save(cfg->ID, init_ssid, init_password, init_masterIP, "resetting wifi");

  gpio->blink(1,1);
  Interrupt::setup();

  if (!cfg->ID || cfg->ID == "") {
    cfg->initialise();
    net->setupWiFi();
  } else {
    net->setupWiFi();
  }
}
 
void loop() {

  server.handleClient();
  Interrupt::handle();
}
