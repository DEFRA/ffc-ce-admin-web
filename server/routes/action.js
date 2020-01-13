const actionService = require('../services/actionService')

const cacheKey = 'action'
module.exports = [
  {
    method: 'POST',
    path: '/action',
    handler: async (request, h) => {
      const actionResult = actionService.performAction()
      request.yar.set(cacheKey, actionResult)
      return h.redirect('/action')
    }
  }, {
    method: 'GET',
    path: '/action',
    handler: async (request, h) => {
      const actionResult = request.yar.get(cacheKey)
      return h.view('action', { actionResult })
    }
  }
]
