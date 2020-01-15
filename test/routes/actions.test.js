// let actionService
require('../../server/services/actionsService')
const mockActionServiceResult = {
  actions: [
    {
      id: 'ID1',
      description: 'Test',
      rules: [{
        id: 1,
        description: 'Test rule',
        enabled: true,
        facts: []
      }]
    }
  ]
}

const mockActionsService = {
  getActions: jest.fn().mockResolvedValue(mockActionServiceResult)
}

function createMocks () {
  jest.mock('../../server/services/actionsService', () => mockActionsService)
}

const requestOptions = {
  method: 'GET',
  url: '/actions'
}

describe('Actions test', () => {
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

  test('GET /actions route calls the actionsService', async () => {
    await server.inject(requestOptions)
    expect(mockActionsService.getActions).toHaveBeenCalled()
  })

  test('GET /actions route gets a 200 response', async () => {
    const getResponse = await server.inject(requestOptions)
    expect(getResponse.statusCode).toBe(200)
  })

  afterEach(async () => {
    await server.stop()
    jest.clearAllMocks()
  })

  afterAll(() => {
    jest.unmock('../../server/services/actionService')
  })
})
