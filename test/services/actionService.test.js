const actionService = require('../../server/services/actionService')

describe('actionService', () => {
  test('action succeeds', () => {
    expect(actionService.performAction()).toEqual(
      expect.objectContaining({ success: true })
    )
  })
})
