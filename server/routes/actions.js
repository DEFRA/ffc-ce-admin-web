const actionService = require('../services/actionsService')
const actionsModel = require('../models/actionsModel')

module.exports = [
  {
    method: 'GET',
    path: '/actions',
    handler: async (request, h) => {
      const actions = await actionService.getActions()
      const model = actionsModel(actions)
      return h.view('actions', { model })
    }
  }
]
