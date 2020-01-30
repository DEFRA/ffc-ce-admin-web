require('../../server/services/toggleRuleService')
const mockToggleRuleResult = {
  id: 1,
  description: 'Test rule',
  enabled: true,
  facts: []
}

const mockToggleRuleService = {
  getRule: jest.fn().mockResolvedValue(mockToggleRuleResult),
  toggleRule: jest.fn().mockResolvedValue(mockToggleRuleResult)
}

function createMocks () {
  jest.mock('../../server/services/toggleRuleService', () => mockToggleRuleService)
}

const actionID = 'FG1'
const ruleID = 1
const enabled = false

const goodGetRequestOptions = {
  method: 'GET',
  url: `/toggle-rule?actionID=${actionID}&ruleID=${ruleID}&actionDescription=test`
}

const badGetRequestOptions = {
  method: 'GET',
  url: `/toggle-rule?actionID=${actionID}&actionDescription=test`
}

const goodPostRequestOptions = {
  method: 'POST',
  url: '/toggle-rule',
  payload: {
    actionID,
    ruleID,
    enabled,
    update: true
  }
}

const goodPostRequestCancelOptions = {
  method: 'POST',
  url: '/toggle-rule',
  payload: {
    actionID,
    ruleID,
    enabled,
    update: false
  }
}

const badPostRequestOptions = {
  method: 'POST',
  url: '/toggle-rule',
  payload: {
    actionID,
    ruleID: 'bad id',
    enabled,
    update: true
  }
}

describe('/toggle-rule route test', () => {
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

  test('GET calls the toggleRuleService and gets a 200 response', async () => {
    const getResponse = await server.inject(goodGetRequestOptions)
    expect(getResponse.statusCode).toBe(200)
    expect(mockToggleRuleService.getRule).toHaveBeenCalledWith(actionID, ruleID)
  })

  test('GET redirects to /actions if malformatted query params received', async () => {
    const postResponse = await server.inject(badGetRequestOptions)
    expect(mockToggleRuleService.getRule).not.toHaveBeenCalled()
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('/actions')
  })

  test('POST calls the toggleRuleService and redirects to /actions', async () => {
    const postResponse = await server.inject(goodPostRequestOptions)
    expect(mockToggleRuleService.toggleRule).toHaveBeenCalledWith(actionID, ruleID, enabled)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('/actions')
  })

  test('POST /toggle-rule route just redirects to /actions if malformatted options received', async () => {
    const postResponse = await server.inject(badPostRequestOptions)
    expect(mockToggleRuleService.toggleRule).not.toHaveBeenCalled()
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('/actions')
  })

  test('POST /toggle-rule route just redirects to /actions if cancel update received', async () => {
    const postResponse = await server.inject(goodPostRequestCancelOptions)
    expect(mockToggleRuleService.toggleRule).not.toHaveBeenCalled()
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('/actions')
  })

  afterEach(async () => {
    await server.stop()
    jest.clearAllMocks()
  })
})
