const wreck = require('@hapi/wreck')

let actionsService
jest.mock('@hapi/wreck')

let getPayload
let putPayload

function stubWreckCall () {
  wreck.defaults = () => {
    return {
      get: () => {
        return Promise.resolve({ payload: getPayload })
      },
      put: () => {
        return Promise.resolve({ payload: putPayload })
      }
    }
  }
}

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

const mockToggleRuleResult = {
  id: 1,
  description: 'Test rule',
  enabled: false,
  facts: []
}

describe('actionService', () => {
  beforeAll(() => {
    // Test follows the structure of parcels-service.test.js from ffc-ce-web, which says:
    // "I tried to stub the call before each, but only the return setup in the first test
    // was returned, despite trying a combination of clear/reset mocks so I resorted to
    // setting the payload to a local variable that can be changed before each test
    // https://github.com/facebook/jest/issues/7136
    // issue was fixed in November. but not perhaps not made it into the lastest version,
    // though there are still requests on the issue above to reopen the bug"
    stubWreckCall()
    actionsService = require('../../server/services/actionsService')
  })

  test('get actions return JSON', async () => {
    getPayload = mockActionServiceResult
    const result = await actionsService.getActions()
    expect(result).toBeDefined()
    expect(result.length).toEqual(1)
    expect(result[0]).toEqual(mockActionServiceResult.actions[0])
  })

  test('get actions returns empty array for empty payload', async () => {
    getPayload = undefined
    const result = await actionsService.getActions()
    expect(result).toBeDefined()
    expect(result.length).toEqual(0)
  })

  test('toggle rule return JSON', async () => {
    getPayload = mockActionServiceResult
    putPayload = mockToggleRuleResult
    const result = await actionsService.toggleRule('FG1', 1, false)
    expect(result).toBeDefined()
    expect(result.length).toEqual(1)
    expect(result[0]).toEqual(mockActionServiceResult.actions[0])
  })

  test('toggle rule still returns list of actions for empty put payload', async () => {
    getPayload = mockActionServiceResult
    putPayload = undefined
    const result = await actionsService.toggleRule('Bad Id', 1, false)
    expect(result.length).toEqual(1)
    expect(result[0]).toEqual(mockActionServiceResult.actions[0])
  })

  afterAll(() => {
    jest.unmock('@hapi/wreck')
  })
})
