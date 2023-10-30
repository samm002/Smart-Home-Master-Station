const { client } = require("../Mqtt/mqtt");
const { getAllRules } = require("../Service/ruleService");
const triggerBuffer = [];
const timeWindowDuration = 2000;
const countdown = timeWindowDuration / 1000;
let timer;
let isFirstTime = true;

const stringifyObject = (obj) => {
  for (const key in obj) {
    if (typeof obj[key] === "object") {
      obj[key] = stringifyObject(obj[key]);
    } else {
      obj[key] = obj[key].toString();
    }
  }
  return obj;
};

const publishAllRulesToMqtt = async (req, res) => {
  const publishTopic = "rule";
  const message = `Rules published to ${publishTopic} topic`;
  try {
    const rulesMap = await getAllRules();

    rulesMap.forEach((ruleData) => {
      client.publish(publishTopic, JSON.stringify(ruleData), (error) => {
        if (error) {
          console.error(`Failed to publish rule: ${JSON.stringify(ruleData)}`);
        }
      });
    });

    res.json({ message });
  } catch (error) {
    console.error("Failed to retrieve or publish rules:", error);
    throw error;
  }
};

const handleMessageFromMQTT = (receivedData) => {
  // Countdown
  isFirstTime
    ? (console.log(
        `Master Station waiting for ${countdown} seconds before processing...`
      ),
      (isFirstTime = false))
    : null;

  const stringifiedreceivedData = stringifyObject(receivedData);
  console.log("Message Receive From Mqtt :", stringifiedreceivedData);

  triggerBuffer.push(stringifiedreceivedData);

  clearTimeout(timer);

  timer = setTimeout(() => {
    console.log("Time window ended, performing comparison...");

    const transformedObject = Object.assign({}, ...triggerBuffer);

    console.log("Entire Trigger Data Received :", transformedObject);
    checkTrigger(transformedObject);
    triggerBuffer.length = 0;
  }, timeWindowDuration);
};

const compareDataWithTrigger = (receivedData, ruleTrigger) => {
  for (const key in ruleTrigger) {
    if (
      ruleTrigger[key] !== receivedData[key] &&
      ruleTrigger[key] !== undefined
    ) {
      return false;
    }
  }
  return true;
};

const checkTrigger = async (message) => {
  try {
    const rulesMap = await getAllRules();

    const stringifiedRulesMap = rulesMap.map((obj) => ({
      rule_id: obj.rule_id,
      trigger: stringifyObject(obj.trigger),
      service: stringifyObject(obj.service),
    }));

    const matchedRules = [];

    stringifiedRulesMap.forEach((rule) => {
      if (compareDataWithTrigger(message, rule.trigger)) {
        matchedRules.push(rule);
      }
    });

    if (matchedRules.length !== 0) {
      if (matchedRules.length === 1) {
        console.log(
          "matched trigger :",
          matchedRules[0].trigger,
          "in rule_id :",
          matchedRules[0].rule_id
        );
        console.log("matched rule :", matchedRules[0]);
      } else {
        for (rule of matchedRules) {
          console.log(
            "matched trigger :",
            rule.trigger,
            "in rule_id :",
            rule.rule_id
          );
          console.log("matched rule :", rule);
        }
      }

      // Publish service data for all matched rules to the corresponding devices
      matchedRules.forEach((matchedRule) => {
        const publishedTopic = "service";
        for (const deviceId in matchedRule.service) {
          const serviceData = {
            [deviceId]: matchedRule.service[deviceId],
          };
          client.publish(
            publishedTopic,
            JSON.stringify(serviceData),
            (error) => {
              if (error) {
                console.error(
                  `Failed to publish service data for device ID ${deviceId}`
                );
              } else {
                console.log(
                  `Message published to topic ${publishedTopic}, message :`,
                  JSON.stringify(serviceData)
                );
              }
            }
          );
        }
      });
    } else {
      console.log("No rule matched trigger input :", message);
    }
  } catch (error) {
    console.error("Kesalahan dalam mengelola pesan:", error);
  }
};

client.on("message", (topic, payload) => {
  try {
    if (topic === "trigger") {
      if (payload) {
        // Pastikan key dari format JSON bertipe string
        const receivedData = JSON.parse(payload);
        handleMessageFromMQTT(receivedData);
      } else {
        // Mengosongkan buffer payload
        client.publish("trigger", "", { retain: false });
      }
    }
  } catch (err) {
    console.error(err);
  }
});

// Coba bikin function untuk post dummy data trigger (belum)
// const postTrigger = (req, res) => {
//   const trigger1 = {};
//   client.publish("service", JSON.stringify(serviceData), (error) => {});
// };

// const publishDummyTrigger = async (req, res) => {
//   const publishTopic = 'trigger'
// }

module.exports = {
  publishAllRulesToMqtt,
};
