const config = require('../config')
const wreck = require('@hapi/wreck').defaults({
  timeout: config.restClientTimeoutMillis
})

async function getRule (actionID, ruleID) {
  const response = await wreck.get(`${config.actionsUrl}/actions`, { json: true })
  const actions = response.payload.actions || []
  const actionIndex = actions.findIndex(action => action.id === actionID)

  if (actionIndex > -1) {
    const ruleIndex = actions[actionIndex].rules.findIndex(rule => rule.id === ruleID)
    if (ruleIndex > -1) return actions[actionIndex].rules[ruleIndex]
  }

  return null
}

async function toggleRule (actionID, ruleID, enabled) {
  const data = JSON.stringify({ enabled: enabled })
  const response = await wreck.put(
    `${config.actionsUrl}/actions/${actionID}/rules/${ruleID}`,
    { json: true, payload: data }
  )
  return response.payload
}

module.exports = {
  getRule,
  toggleRule
}
