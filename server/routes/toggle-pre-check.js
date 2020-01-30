const togglePreCheckService = require('../services/togglePreCheckService')
const togglePreCheckModel = require('../models/togglePreCheckModel')
const togglePreCheckPostSchema = require('../schemas/togglePreCheckPostSchema')
const togglePreCheckGetSchema = require('../schemas/togglePreCheckGetSchema')

module.exports = [
  {
    method: 'GET',
    path: '/toggle-pre-check',
    handler: async (request, h) => {
      const { actionID, actionDescription } = request.query
      const preCheck = await togglePreCheckService.getPreCheck(actionID)
      const model = togglePreCheckModel(actionID, actionDescription, preCheck)
      return h.view('togglePreCheck', { model })
    },
    options: {
      validate: {
        query: togglePreCheckGetSchema,
        failAction: async (request, h) => {
          console.log('/toggle-pre-check: Failed to validate GET query params', request.query)
          // Fail silently for now and redirect to list of action rules
          // as it is unclear for the demo what to display and where.
          return h.redirect('/actions').takeover()
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/toggle-pre-check',
    handler: async function (request, h) {
      const { actionID, enabled, update } = request.payload

      if (update) {
        console.log(`Request to set pre-check for actionID=${actionID} to ${enabled}`)
        // No endpoint to toggle rule yet, but will go in here
      }

      return h.redirect('/actions')
    },
    options: {
      validate: {
        payload: togglePreCheckPostSchema,
        failAction: async (request, h) => {
          console.log('/toggle-pre-check: Failed to validate POST data', request.payload)
          // Fail silently for now and redirect to list of action rules
          // as it is unclear for the demo what to display and where.
          return h.redirect('/actions').takeover()
        }
      }
    }
  }
]
