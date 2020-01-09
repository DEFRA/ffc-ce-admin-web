const address = 'test@address'
let paymentService
jest.mock('@hapi/wreck')

function stubWreckCall () {
  const wreck = require('@hapi/wreck')
  wreck.defaults = () => {
    return {
      post: () => {
        return Promise.resolve({ payload: { user: address, date: '2019-12-31T13:30:04.156Z' } })
      }
    }
  }
  paymentService = require('../../server/services/paymentService')
}

describe('paymentService', () => {
  beforeAll(() => {
    stubWreckCall()
  })

  test('create payment', async () => {
    const result = await paymentService.createPayment(address)
    expect(result).toBeDefined()
    expect(result.user).toEqual(address)
    expect(result.date).toBeDefined()
  })

  afterAll(async () => {
    jest.unmock('@hapi/wreck')
  })
})
