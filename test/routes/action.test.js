// let actionService
require('../../server/services/actionService')
const mockActionServiceResult = { success: true }

function createMocks () {
  jest.mock('../../server/services/actionService', () => ({
    performAction: jest.fn(() => mockActionServiceResult)
  }))
  /* actionService = require('../../server/services/actionService')
  actionService.performAction = jest.fn(() => (actionServiceMockResult)) */
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

describe('Action test', () => {
  let createServer
  let server

  beforeAll(() => {
    createMocks()
    createServer = require('../../server/createServer')
  })

  beforeEach(async () => {
    server = await createServer()
    await server.initialize()
  })

  test('POST /action route redirects to GET /action with session cookie', async () => {
    const postOptions = {
      method: 'POST',
      url: '/action'
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)

    const getResponse = await server.inject(getRedirectOptions(postResponse))
    expect(getResponse.statusCode).toBe(200)

    // check action result is reported...
    expect(getResponse.payload).toContain('Action was successful')
  })

  afterEach(async () => {
    await server.stop()
  })

  afterAll(() => {
    jest.unmock('../../server/services/actionService')
  })
})
