#include <WiFiS3.h>
#include <ArduinoHttpClient.h>
#include <dht.h>
#include <ArduinoJson.h>

#define dht_apin A1

dht DHT;

const char ssid[] = "Orbic-Speed-RC400L-wxyz";//"SJSU_guest";//"ztvl";//"eduroam";//"Wifi 25";
const char pass[] = "z0ruicrhrm";//"";//"4087230676";//"Sl33pUnderTheSun";

const int moistureSensorPin = A0;
const int moistureSensorPower = 8;
const int dhtSensorPower = 7;

char server[] = "raspberrypi.taile3d8de.ts.net";//"10.0.0.232"; // using tailscale proxy for my macbook
int port = 443;//8080;
String endpoint = "/data";

//WiFiClient wifi;
WiFiSSLClient net;
HttpClient client = HttpClient(net, server, port);

void setup() {
  Serial.begin(115200);
  pinMode(moistureSensorPower,OUTPUT);
  pinMode(dhtSensorPower,OUTPUT);

  while (!Serial);
  Serial.println("Scanning for networks...");

  int n = WiFi.scanNetworks();
  if (n == 0) Serial.println("No networks found.");
  else {
    for (int i = 0; i < n; i++) {
      Serial.print(i + 1);
      Serial.print(": ");
      Serial.print(WiFi.SSID(i));
      Serial.print(" (");
      Serial.print(WiFi.RSSI(i));
      Serial.print(" dBm)");
      Serial.println();
      delay(10);
    }
  }

  while (WiFi.status() != WL_CONNECTED) {
    Serial.println("Connecting to WiFi...");
    WiFi.begin(ssid, pass);
    delay(2000);
  }

  Serial.println("WiFi connected!");
  Serial.println(WiFi.localIP());

}

void loop() {
  digitalWrite(dhtSensorPower,HIGH);
  delay(2000);
  DHT.read11(dht_apin);//take temp and hum readings
  float temp = (DHT.temperature*(double(9.0/5.0)))+32;
  Serial.println("Temp: "+String(temp)+" F");
  float humidity = (DHT.humidity);
  digitalWrite(dhtSensorPower,LOW);
  Serial.println("Humidity: "+String(humidity)+ " %");

  digitalWrite(moistureSensorPower,HIGH);//turn on sensor power
  int soil = analogRead(moistureSensorPin);
  digitalWrite(moistureSensorPower,LOW); //turn off sensor power to prevent corrosion
  Serial.print("soil Moisture Lvl: ");
  Serial.println(soil);

  if (isnan(temp) || isnan(humidity)) {
    Serial.println("Failed to read from DHT!");
    return;
  }

  StaticJsonDocument<200> doc;
  doc["temperature"] = temp;
  doc["humidity"] = humidity;
  doc["soil_moisture"] = soil;

  String json;
  serializeJson(doc, json);

  client.beginRequest();
  client.post(endpoint);
  client.sendHeader("Content-Type", "application/json");
  client.sendHeader("Content-Length", json.length());
  client.beginBody();
  client.print(json);
  client.endRequest();

  int statusCode = client.responseStatusCode();
  String response = client.responseBody();

  Serial.print("Status code: ");
  Serial.println(statusCode);
  Serial.print("Response: ");
  Serial.println(response);

  delay(900000); // every 15 minutes in ms
}
