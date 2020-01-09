const config = require('../config')
const wreck = require('@hapi/wreck').defaults({
  timeout: config.restClientTimeoutMillis
})

async function createPayment (email) {
  const response = await wreck.post(`${config.paymentUrl}/payment`, { json: true, payload: { email } })
  return response.payload
}

module.exports = { createPayment }
