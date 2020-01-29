function toggleRuleModel (actionID, actionDescription, preCheck, errorMessage) {
  return {
    action: {
      id: actionID,
      description: actionDescription
    },
    preCheck,
    errorMessage: errorMessage || ''
  }
}

module.exports = toggleRuleModel
