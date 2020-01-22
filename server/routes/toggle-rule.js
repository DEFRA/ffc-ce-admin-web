const toggleRuleService = require('../services/toggleRuleService')
const toggleRuleModel = require('../models/toggleRuleModel')
const toggleRulePostSchema = require('../schemas/toggleRulePostSchema')
const toggleRuleGetSchema = require('../schemas/toggleRuleGetSchema')

module.exports = [
  {
    method: 'GET',
    path: '/toggle-rule',
    handler: async (request, h) => {
      const { actionID, actionDescription, ruleID } = request.query
      const rule = await toggleRuleService.getRule(actionID, parseInt(ruleID))
      const model = toggleRuleModel(actionID, actionDescription, rule)
      return h.view('toggleRule', { model })
    },
    options: {
      validate: {
        query: toggleRuleGetSchema,
        failAction: async (request, h) => {
          console.log('/toggle-rule: Failed to validate GET query params', request.query)
          // Fail silently for now and redirect to list of action rules
          // as it is unclear for the demo what to display and where.
          return h.redirect('/actions').takeover()
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/toggle-rule',
    handler: async function (request, h) {
      const { actionID, ruleID, enabled, update } = request.payload

      if (update) {
        console.log(`Request to set ruleID=${ruleID} for actionID=${actionID} to ${enabled}`)
        await toggleRuleService.toggleRule(actionID, ruleID, enabled)
      }

      return h.redirect('/actions')
    },
    options: {
      validate: {
        payload: toggleRulePostSchema,
        failAction: async (request, h) => {
          console.log('/toggle-rule: Failed to validate POST data', request.payload)
          // Fail silently for now and redirect to list of action rules
          // as it is unclear for the demo what to display and where.
          return h.redirect('/actions').takeover()
        }
      }
    }
  }
]
