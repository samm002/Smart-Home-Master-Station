const Rule = require("../Models/ruleModel");

const ruleFormat = (rule) => {
  return {
    rule_id: rule.rule_id,
    trigger: rule.trigger,
    service: rule.service,
  };
};

const getAllRules = async () => {
  const rules = await Rule.find();
  return rules.map((rule) => ruleFormat(rule));
};

const getAllTriggers = async () => {
  const rules = await Rule.find();
  const triggerMap = rules.map((rule) => ({
    trigger: rule.trigger,
  }));
  return triggerMap;
}

const getRuleByRule_id = async (rule_id) => {
  try {
    const rule = await Rule.findOne({ rule_id });
    console.log(`Getting rule with rule_id : ${rule_id}`);
    if (rule) {
      console.log(`Showing rule with rule_id : ${rule_id}`);
      return ruleFormat(rule);
    } else {
      console.log(`Rule with rule_id : ${rule_id} not found`);
      return { error: `Rule with rule_id : ${rule_id} not found` };
    }
  } catch (err) {
    throw new Error("Failed to get rule by rule_id");
  }
};

const createOrUpdateRule = async (rule_id, trigger, service) => {
  try {
    const rule = await Rule.findOne({ rule_id });
    console.log(`Creating / Updating rule`);
    
    if (rule) {
      rule.trigger = trigger;
      rule.service = service;
      const updatedRule = await rule.save();
      console.log(`Rule_id : ${rule.rule_id} already exist, updating the rule`);
      return ruleFormat(updatedRule);
    } else {
      const newRule = new Rule({ rule_id, trigger, service });
      const savedNewRule = await newRule.save();
      console.log(`Created new rule with rule_id : ${savedNewRule.rule_id}`);
      return ruleFormat(savedNewRule);
    }
  } catch (error) {
    throw new Error("Failed to create/update rule");
  }
};

const updateRule = async (rule_id, trigger, service) => {
  try {
    const rule = await Rule.findOne({ rule_id });
    console.log(`Updating rule`);

    if (rule) {
      if (trigger) {
        rule.trigger = trigger;
      }
      if (service) {
        rule.service = service;
      }
      const updatedRule = await rule.save();
      console.log(`rule id : ${rule_id} deleted successfully`);
      return ruleFormat(updatedRule);
      
    } else {
      console.log(`Failed updating rule, rule with rule_id : ${rule_id} not found`);
      return { error: `Failed updating rule, rule with rule_id ${rule_id} not found` };
    }
  } catch (error) {
    throw new Error("Failed to update rule");
  }
};

const deleteRule = async (rule_id) => {
  try {
    const result = await Rule.deleteOne({ rule_id });
      if (result.deletedCount === 1) {
        console.log(`rule id : ${rule_id} deleted successfully`);
        return { message: `rule id : ${rule_id} deleted successfully` };
      } else {
        console.log(`Failed deleting rule, rule with rule_id : ${rule_id} not found`);
        return { error: `Failed updating rule, rule with rule_id ${rule_id} not found` };
      }
  } catch (err) {
    throw new Error("Failed to delete rule");
  }
}

module.exports = {
  getAllTriggers,
  getAllRules,
  getRuleByRule_id,
  createOrUpdateRule,
  updateRule,
  deleteRule,
}