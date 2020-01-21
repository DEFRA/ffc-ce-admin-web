function toggleRuleModel (actionID, actionDescription, rule, errorMessage) {
  return {
    action: {
      id: actionID,
      description: actionDescription
    },
    rule,
    errorMessage: errorMessage || ''
  }
}

module.exports = toggleRuleModel
