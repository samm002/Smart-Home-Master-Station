const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema({
  rule_id: String,
  trigger: Object,
  service: Object,
});

const Rule = mongoose.model('Rule', ruleSchema);

module.exports = Rule;