// let actionService
require('../../server/services/actionsService')
const mockActionServiceResult = [
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

const mockActionsService = {
  getActions: jest.fn().mockResolvedValue(mockActionServiceResult)
}

function createMocks () {
  jest.mock('../../server/services/actionsService', () => mockActionsService)
}

const getRequestOptions = {
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
    await server.inject(getRequestOptions)
    expect(mockActionsService.getActions).toHaveBeenCalled()
  })

  test('GET /actions route gets a 200 response', async () => {
    const getResponse = await server.inject(getRequestOptions)
    expect(getResponse.statusCode).toBe(200)
  })

  afterEach(async () => {
    await server.stop()
    jest.clearAllMocks()
  })
})
