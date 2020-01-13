const actionService = require('../services/actionService')

module.exports = {
  method: 'POST',
  path: '/action',
  options: {
    handler: async (request, h) => {
      actionService.performAction()
      return h.view('action')
    }
  }
}
