let actionsService
jest.mock('@hapi/wreck')

let payload

function stubWreckCall () {
  const wreck = require('@hapi/wreck')
  wreck.defaults = () => {
    return {
      get: () => {
        return Promise.resolve({ payload })
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
    payload = mockActionServiceResult
    const result = await actionsService.getActions()
    expect(result).toBeDefined()
    expect(result.length).toEqual(1)
    expect(result[0]).toEqual(mockActionServiceResult.actions[0])
  })

  test('get actions returns empty array for empty payload', async () => {
    payload = undefined
    const result = await actionsService.getActions()
    expect(result).toBeDefined()
    expect(result.length).toEqual(0)
  })

  afterAll(() => {
    jest.unmock('@hapi/wreck')
  })
})
