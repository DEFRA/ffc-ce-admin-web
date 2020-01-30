require('../../server/services/togglePreCheckService')

const mockTogglePreCheckService = {
  getPreCheck: jest.fn().mockResolvedValue(true)
}

function createMocks () {
  jest.mock('../../server/services/togglePreCheckService', () => mockTogglePreCheckService)
}

const actionID = 'FG1'
const enabled = false

const goodGetRequestOptions = {
  method: 'GET',
  url: `/toggle-pre-check?actionID=${actionID}&actionDescription=test`
}

const badGetRequestOptions = {
  method: 'GET',
  url: `/toggle-rule?actionID=${actionID}`
}

const goodPostRequestOptions = {
  method: 'POST',
  url: '/toggle-pre-check',
  payload: {
    actionID,
    enabled,
    update: true
  }
}

const goodPostRequestCancelOptions = {
  method: 'POST',
  url: '/toggle-pre-check',
  payload: {
    actionID,
    enabled,
    update: false
  }
}

const badPostRequestOptions = {
  method: 'POST',
  url: '/toggle-pre-check',
  payload: {
    actionID: 1,
    enabled,
    update: true
  }
}

describe('/toggle-pre-check route test', () => {
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
    expect(mockTogglePreCheckService.getPreCheck).toHaveBeenCalledWith(actionID)
  })

  test('GET redirects to /actions if malformatted query params received', async () => {
    const postResponse = await server.inject(badGetRequestOptions)
    expect(mockTogglePreCheckService.getPreCheck).not.toHaveBeenCalled()
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('/actions')
  })

  // For the following three tests, the togglePreCheck hasn't been implemented yet (another
  // ticket exists to do this) but we can test the POST calls and validate the data schema

  test('POST calls the toggleRuleService and redirects to /actions', async () => {
    const postResponse = await server.inject(goodPostRequestOptions)
    // expect(mockTogglePreCheckService.togglePreCheck).toHaveBeenCalledWith(actionID, enabled)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('/actions')
  })

  test('POST redirects to /actions if malformatted options received', async () => {
    const postResponse = await server.inject(badPostRequestOptions)
    // expect(mockTogglePreCheckService.togglePreCheck).not.toHaveBeenCalled()
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('/actions')
  })

  test('POST redirects to /actions if cancel update received', async () => {
    const postResponse = await server.inject(goodPostRequestCancelOptions)
    // expect(mockTogglePreCheckService.togglePreCheck).not.toHaveBeenCalled()
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('/actions')
  })

  afterEach(async () => {
    await server.stop()
    jest.clearAllMocks()
  })

  afterAll(() => {
    jest.unmock('../../server/services/toggleRuleService')
  })
})
