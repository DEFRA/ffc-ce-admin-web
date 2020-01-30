const toggleRuleModel = require('../../server/models/toggleRuleModel')

describe('toggleRuleModel', () => {
  test('should set items value and text, and error message', () => {
    const actionID = '123'
    const actionDescription = '456'
    const errorMessage = 'error'
    const rule = {
      id: 1,
      description: 'Test rule',
      enabled: true,
      facts: [
        { description: 'Test fact' }
      ]
    }

    const model = toggleRuleModel(actionID, actionDescription, rule, errorMessage)

    expect(model).toBeDefined()
    expect(model.errorMessage).toEqual(errorMessage)
    expect(model.action).toBeDefined()
    expect(model.action.id).toEqual(actionID)
    expect(model.action.description).toEqual(actionDescription)
    expect(model.rule).toBeDefined()
    expect(model.rule.id).toEqual(rule.id)
    expect(model.rule.description).toEqual(rule.description)
    expect(model.rule.enabled).toEqual(rule.enabled)
    expect(model.rule.facts[0].description).toEqual(rule.facts[0].description)
  })
})
