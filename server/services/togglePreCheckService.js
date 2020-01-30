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

module.exports = {
  getPreCheck
}
