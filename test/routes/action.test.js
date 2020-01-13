let actionService

function createMocks () {
  jest.mock('../../server/services/actionService')
  actionService = require('../../server/services/actionService')
  actionService.performAction = () => { return { success: true } }
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

  test('POST /action route returns 200', async () => {
    const postOptions = {
      method: 'POST',
      url: '/action'
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
  })

  afterEach(async () => {
    await server.stop()
  })

  afterAll(() => {
    jest.unmock('../../server/services/actionService')
  })
})
