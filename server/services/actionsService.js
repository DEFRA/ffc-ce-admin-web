const config = require('../config')
const wreck = require('@hapi/wreck').defaults({
  timeout: config.restClientTimeoutMillis
})

async function getActions () {
  const response = await wreck.get(`${config.actionsUrl}/actions`, { json: true })
  console.log('actions retrieved', response.payload)
  const actions = response.payload && response.payload.actions
  return actions || []
}

async function toggleRule (actionID, ruleID, enabled) {
  const data = JSON.stringify({ enabled: enabled })
  await wreck.put(`${config.actionsUrl}/actions/${actionID}/rules/${ruleID}`, { json: true, payload: data })
  const actions = await getActions()
  return actions
}

module.exports = {
  getActions,
  toggleRule
}
