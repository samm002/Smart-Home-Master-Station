const ruleService = require('../Service/ruleService')

const getAllTriggers = async (req, res) => {
  try {
    const triggers = await ruleService.getAllTriggers();
    res.json(triggers);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve triggers" });
  }
};

const getAllRules = async (req, res) => {
  try {
    const rules = await ruleService.getAllRules();
    res.json(rules);
  } catch (error) {
  }
};

const getRuleByRule_id = async (req, res) => {
  const { rule_id } = req.params;
  try {
    const rule = await ruleService.getRuleByRule_id(rule_id);
    res.json(rule);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve rules" });
  }
};

const createOrUpdateRule = async (req, res) => {
  const { rule_id, trigger, service } = req.body;
  try {
    const rule = await ruleService.createOrUpdateRule(rule_id, trigger, service);
    res.json(rule);
  } catch (error) {
    res.status(500).json({ error: "Failed to create/update the rule" });
  }
};

const updateRule = async (req, res) => {
  const { rule_id } = req.params;
  const { trigger, service } = req.body;

  try {
    const updatedRule = await ruleService.updateRule(rule_id, trigger, service);
    res.json(updatedRule)

  } catch (error) {
    res.status(500).json({ error: "Failed to update the rule" });
  }
};

const deleteRule = async (req, res) => {
  const { rule_id } = req.params;
  try {
    const deletedRule = ruleService.deleteRule(rule_id);
    res.json(deletedRule)
  } catch (error) {
    res.status(500).json({ error: "Failed to delete rule" });
  }
};

module.exports = {
  getAllTriggers,
  getAllRules,
  getRuleByRule_id,
  createOrUpdateRule,
  updateRule,
  deleteRule,
};
