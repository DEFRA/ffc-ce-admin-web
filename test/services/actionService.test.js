const actionService = require('../../server/services/actionService')

describe('actionService', () => {
  test('action succeeds', () => {
    const result = actionService.performAction()
    expect(result).toEqual(
      expect.objectContains({ success: true })
    )
  })
})
