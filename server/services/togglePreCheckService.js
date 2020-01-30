const config = require('../config')
const wreck = require('@hapi/wreck').defaults({
  timeout: config.restClientTimeoutMillis
})

async function getPreCheck (actionID) {
  const response = await wreck.get(`${config.actionsUrl}/actions`, { json: true })
  const actions = response.payload.actions || []
  const action = actions.find(action => action.id === actionID)
  return action ? action.precheck : null
}

async function togglePreCheck (actionID, enabled) {
  const data = JSON.stringify({ enabled: enabled })
  const response = await wreck.put(
    `${config.actionsUrl}/actions/${actionID}`,
    { json: true, payload: data }
  )
  return response.payload
}

module.exports = {
  getPreCheck,
  togglePreCheck
}
