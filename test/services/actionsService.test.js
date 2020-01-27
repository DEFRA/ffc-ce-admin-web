const wreck = require('@hapi/wreck')

let actionsService
jest.mock('@hapi/wreck')

let payload

function stubWreckCall () {
  wreck.defaults = () => {
    return {
      get: () => {
        return Promise.resolve({ payload })
      }
    }
  }
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

  afterAll(() => {
    jest.unmock('@hapi/wreck')
  })

  describe('getActions', () => {
    test('returns array of actions provided by remote API', async () => {
      payload = {
        actions: [
          {
            id: 'ID1',
            description: 'Test',
            rules: [
              {
                id: 1,
                description: 'Test rule',
                enabled: true,
                facts: [],
                type: 'some-type'
              }
            ]
          }
        ]
      }
      const result = await actionsService.getActions()
      expect(result).toEqual(payload.actions)
    })

    test('creates a rule type field using the first item in each rule types array', async () => {
      payload = {
        actions: [
          {
            id: 'ID1',
            description: 'Test',
            rules: [
              {
                id: 1,
                description: 'Test rule 1',
                enabled: true,
                facts: [],
                types: ['some-type', 'some-other-type']
              },
              {
                id: 2,
                description: 'Test rule 2',
                enabled: true,
                facts: [],
                types: ['some-other-type']
              }
            ]
          }
        ]
      }
      const result = await actionsService.getActions()
      expect(result).toEqual(expect.any(Array))
      expect(result.length).toBe(1)
      expect(result[0].rules.length).toBe(2)
      expect(result[0].rules[0].type).toBe('some-type')
      expect(result[0].rules[1].type).toBe('some-other-type')
    })

    test('does not overwrite an existing rule type field from types array', async () => {
      payload = {
        actions: [
          {
            id: 'ID1',
            description: 'Test',
            rules: [
              {
                id: 1,
                description: 'Test rule',
                enabled: true,
                facts: [],
                type: 'some-type',
                types: ['some-other-type']
              }
            ]
          }
        ]
      }
      const result = await actionsService.getActions()
      expect(result).toEqual(expect.any(Array))
      expect(result.length).toBe(1)
      expect(result[0].rules.length).toBe(1)
      expect(result[0].rules[0].type).toBe('some-type')
    })

    test('returns empty array for empty payload', async () => {
      payload = undefined
      const result = await actionsService.getActions()
      expect(result).toBeDefined()
      expect(result.length).toBe(0)
    })
  })
})
