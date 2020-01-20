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
  getActions: jest.fn().mockResolvedValue(mockActionServiceResult),
  toggleRule: jest.fn().mockResolvedValue(mockActionServiceResult)
}

function createMocks () {
  jest.mock('../../server/services/actionsService', () => mockActionsService)
}

const getRequestOptions = {
  method: 'GET',
  url: '/actions'
}

const actionID = 'FG1'
const ruleID = 1
const enabled = false

const goodPostRequestOptions = {
  method: 'POST',
  url: '/actions',
  payload: {
    actionID,
    ruleID,
    enabled
  }
}

const badPostRequestOptions = {
  method: 'POST',
  url: '/actions',
  payload: {
    actionID,
    ruleID: 'bad id',
    enabled
  }
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

  test('POST /actions route calls the actionsService', async () => {
    await server.inject(goodPostRequestOptions)
    expect(mockActionsService.toggleRule).toHaveBeenCalledWith(actionID, ruleID, enabled)
  })

  test('POST /actions route returns error message if malformatted options received', async () => {
    const postResponse = await server.inject(badPostRequestOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Failed to change rule: invalid data submitted')
  })

  afterEach(async () => {
    await server.stop()
    jest.clearAllMocks()
  })

  afterAll(() => {
    jest.unmock('../../server/services/actionService')
  })
})
