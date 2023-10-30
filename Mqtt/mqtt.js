const mqtt = require("mqtt");
require("dotenv").config();

// Configuration for local mosquitto broker
const options = {
  host: "localhost",
  port: "1883",
  protocol: "mqtt",
  clientId: "fba93eca-a442-4369-97e4-2ab7b810519d",
  clean: true,
};

// Configuration for online broker HiveMQ
// const options = {
//   host: 'c1dcbff74f7f4bc99c455565d852cdad.s2.eu.hivemq.cloud',
//   port: 8883,
//   protocol: 'mqtts',
//   username: 'samm002',
//   password: `${process.env.MQTT_BROKER_PASSWORD}`
// }

const client = mqtt.connect(options);
const topic = "trigger";

client.on("connect", () => {
  console.log("Connected to MQTT broker...");
  client.subscribe(topic, (err) => {
    if (!err) {
      console.log(`Master Station Succefully Subscribe to topic : ${topic}`);
      console.log("Waiting for Mqtt messages...");
    } else {
      console.log(`Subscribe to topic : ${topic} failed`);
    }
  });
});

client.on("disconnect", (packet) => {
  console.log(packet);
});

client.on("error", (error) => {
  console.error("MQTT client error:", error.message);
});

client.on("close", () => {
  console.log("Disconnected from MQTT broker");
});

module.exports = {
  client,
};
