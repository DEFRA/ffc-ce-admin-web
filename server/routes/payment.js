const paymentService = require('../services/paymentService')

const cacheKey = 'payment'
module.exports = [
  {
    method: 'POST',
    path: '/payment',
    options: {
      handler: async (request, h) => {
        const payment = await paymentService.createPayment('test@defra.gov.uk')
        request.yar.set(cacheKey, payment)
        return h.redirect('/payment')
      }
    }
  },
  {
    method: 'GET',
    path: '/payment',
    options: {
      handler: async (request, h) => {
        const payment = request.yar.get(cacheKey)
        return h.view('payment', { payment })
      }
    }
  }
]
