const config = require('../config')
const wreck = require('@hapi/wreck').defaults({
  timeout: config.restClientTimeoutMillis
})

async function getActions () {
  const response = await wreck.get(`${config.actionsUrl}/actions`, { json: true })
  console.log('actions retrieved', response.payload)
  const actions = response.payload && response.payload.actions
  return Array.isArray(actions) ? actions.map(parseAction) : []
}

function parseAction (action) {
  action.rules = action.rules.map(parseRule)
  return action
}

function parseRule (rule) {
  if (Array.isArray(rule.types) && typeof rule.type === 'undefined') {
    rule.type = rule.types[0]
  }
  return rule
}

module.exports = {
  getActions
}
