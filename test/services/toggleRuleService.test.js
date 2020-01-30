const wreck = require('@hapi/wreck')

let toggleRuleService
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

const actionID = 'FG1'
const ruleID = 1

const mockToggleRuleResult = {
  id: ruleID,
  description: 'Test rule',
  enabled: false,
  facts: []
}

const mockGetActionsResult = {
  actions: [
    {
      id: actionID,
      description: 'Test',
      rules: [{
        id: ruleID,
        description: 'Test rule',
        enabled: true,
        facts: []
      }]
    }
  ]
}

describe('toggleRuleService', () => {
  beforeAll(() => {
    // Test follows the structure of parcels-service.test.js from ffc-ce-web, which says:
    // "I tried to stub the call before each, but only the return setup in the first test
    // was returned, despite trying a combination of clear/reset mocks so I resorted to
    // setting the payload to a local variable that can be changed before each test
    // https://github.com/facebook/jest/issues/7136
    // issue was fixed in November. but not perhaps not made it into the lastest version,
    // though there are still requests on the issue above to reopen the bug"
    stubWreckCall()
    toggleRuleService = require('../../server/services/toggleRuleService')
  })

  test('get rule returns JSON with known rule and action id', async () => {
    getPayload = mockGetActionsResult
    const result = await toggleRuleService.getRule(actionID, ruleID)
    expect(result).toBeDefined()
    expect(result).toEqual(mockGetActionsResult.actions[0].rules[0])
  })

  test('get rule returns null for unknown actionID', async () => {
    getPayload = mockGetActionsResult
    const result = await toggleRuleService.getRule('bad id', ruleID)
    expect(result).toBeNull()
  })

  test('get rule returns null for unknown ruleID', async () => {
    getPayload = mockGetActionsResult
    const result = await toggleRuleService.getRule(actionID, 0)
    expect(result).toBeNull()
  })

  test('toggle rule returns JSON on successful update', async () => {
    putPayload = mockToggleRuleResult
    const result = await toggleRuleService.toggleRule(actionID, ruleID, false)
    expect(result).toBeDefined()
    expect(result).toEqual(mockToggleRuleResult)
  })

  test('toggle rule returns undefined on unsuccessful update', async () => {
    putPayload = undefined
    const result = await toggleRuleService.toggleRule('badID', ruleID, false)
    expect(result).toBeUndefined()
  })
})
