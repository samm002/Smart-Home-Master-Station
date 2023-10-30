const express = require("express");
const router = express.Router();
const ruleController = require("../Controllers/ruleController");
const mqttController = require("../Controllers/mqttController");

router.post("/", ruleController.createOrUpdateRule);
router.get("/", ruleController.getAllRules);
router.get("/trigger", ruleController.getAllTriggers);
router.get("/:rule_id", ruleController.getRuleByRule_id);
router.put("/:rule_id", ruleController.updateRule);
router.delete("/:rule_id", ruleController.deleteRule);
router.post("/rule", mqttController.publishAllRulesToMqtt);

module.exports = router;
