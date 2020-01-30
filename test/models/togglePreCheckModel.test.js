const togglePreCheckModel = require('../../server/models/togglePreCheckModel')

describe('togglePreCheckModel', () => {
  test('should set items value and text, and error message', () => {
    const actionID = '123'
    const actionDescription = '456'
    const errorMessage = 'error'
    const preCheck = true

    const model = togglePreCheckModel(actionID, actionDescription, preCheck, errorMessage)

    expect(model).toBeDefined()
    expect(model.errorMessage).toEqual(errorMessage)
    expect(model.action).toBeDefined()
    expect(model.action.id).toEqual(actionID)
    expect(model.action.description).toEqual(actionDescription)
    expect(model.preCheck).toBeDefined()
    expect(model.preCheck).toEqual(preCheck)
  })
})
