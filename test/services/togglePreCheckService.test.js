const wreck = require('@hapi/wreck')

let togglePreCheckService
jest.mock('@hapi/wreck')

let getPayload

function stubWreckCall () {
  wreck.defaults = () => {
    return {
      get: () => {
        return Promise.resolve({ payload: getPayload })
      }
    }
  }
}

const actionID = 'FG1'
const enabled = true
const mockGetActionsResult = {
  actions: [
    {
      id: actionID,
      description: 'Test',
      precheck: enabled,
      rules: [{
        id: 1,
        description: 'Test rule',
        enabled: true,
        facts: []
      }]
    }
  ]
}

describe('togglePreCheckService', () => {
  beforeAll(() => {
    stubWreckCall()
    togglePreCheckService = require('../../server/services/togglePreCheckService')
  })

  test('getPreCheck returns boolean with action id', async () => {
    getPayload = mockGetActionsResult
    const result = await togglePreCheckService.getPreCheck(actionID)
    expect(result).toBeDefined()
    expect(result).toEqual(enabled)
  })

  test('getPreCheck returns null for unknown actionID', async () => {
    getPayload = mockGetActionsResult
    const result = await togglePreCheckService.getPreCheck('bad id')
    expect(result).toBeNull()
  })

  afterAll(() => {
    jest.unmock('@hapi/wreck')
  })
})
