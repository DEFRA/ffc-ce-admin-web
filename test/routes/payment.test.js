let paymentService
const testUser = 'test@address'
function createMocks () {
  jest.mock('../../server/services/paymentService')
  paymentService = require('../../server/services/paymentService')
  paymentService.createPayment = () => { return { user: testUser, date: '2019-12-31T13:30:04.156Z' } }
}

function extractSessionCookie (response) {
  const setCookie = response.headers['set-cookie']
  return (setCookie && setCookie[0]) ? setCookie[0].split(';')[0] : ''
}

function getRedirectOptions (response) {
  const cookie = extractSessionCookie(response)
  return {
    method: 'GET',
    headers: { cookie },
    url: response.headers.location
  }
}

describe('Payment test', () => {
  let createServer
  let server

  beforeAll(async () => {
    createMocks()
    createServer = require('../../server/createServer')
  })

  beforeEach(async () => {
    server = await createServer()
    await server.initialize()
  })

  test('POST /payment route redirects to GET /payment with session cookie', async () => {
    const postOptions = {
      method: 'POST',
      url: '/payment'
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)

    const getResponse = await server.inject(getRedirectOptions(postResponse))
    expect(getResponse.statusCode).toBe(200)
    // verify service response is rendered on the page
    expect(getResponse.payload).toContain(testUser)
  })

  afterEach(async () => {
    await server.stop()
  })

  afterAll(() => {
    jest.unmock('../../server/services/paymentService')
  })
})
