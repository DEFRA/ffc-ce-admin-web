const actionsService = require('../services/actionsService')
const actionsModel = require('../models/actionsModel')
const actionsPostSchema = require('../schemas/actionsPostSchema')

module.exports = [
  {
    method: 'GET',
    path: '/actions',
    handler: async (request, h) => {
      const actions = await actionsService.getActions()
      const model = actionsModel(actions)
      return h.view('actions', { model })
    }
  },
  {
    method: 'POST',
    path: '/actions',
    handler: async function (request, h) {
      const { actionID, ruleID, enabled } = request.payload
      console.log(`Request to set ruleID=${ruleID} for actionID=${actionID} to ${enabled}`)
      const actions = await actionsService.toggleRule(actionID, ruleID, enabled)
      const model = actionsModel(actions)
      return h.view('actions', { model })
    },
    options: {
      validate: {
        payload: actionsPostSchema,
        failAction: async (request, h) => {
          console.log('/actions: Failed to validate POST data', request.payload)
          const actions = await actionsService.getActions()
          const model = actionsModel(actions, 'Failed to change rule: invalid data submitted')
          return h.view('actions', { model }).takeover()
        }
      }
    }
  }
]
