const wreck = require('@hapi/wreck')

let togglePreCheckService
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

const mockToggleActionResult = {
  id: actionID,
  description: 'Fencing',
  rate: 4,
  precheck: !enabled,
  rules: []
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

  test('togglePreCheck returns JSON on successful update', async () => {
    putPayload = mockToggleActionResult
    const result = await togglePreCheckService.togglePreCheck(actionID, false)
    expect(result).toBeDefined()
    expect(result).toEqual(mockToggleActionResult)
  })

  test('togglePreCheck returns undefined on unsuccessful update', async () => {
    putPayload = undefined
    const result = await togglePreCheckService.togglePreCheck('badID', false)
    expect(result).toBeUndefined()
  })

  afterAll(() => {
    jest.unmock('@hapi/wreck')
  })
})
