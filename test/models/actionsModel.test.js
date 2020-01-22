const actionModel = require('../../server/models/actionsModel')

describe('actionsModel', () => {
  test('should set items value and text, and error message', () => {
    const action = {
      id: 'id1',
      description: 'description',
      rules: [{
        id: 1,
        description: 'Test rule',
        enabled: true,
        facts: [
          { description: 'Test fact' }
        ]
      }]
    }
    const errorMessage = 'error'
    const model = actionModel([action], errorMessage)
    expect(model).toBeDefined()
    expect(model.errorMessage).toEqual(errorMessage)
    expect(model.items).toBeDefined()
    expect(model.items.length).toEqual(1)
    expect(model.items[0].actionID).toEqual(action.id)
    expect(model.items[0].heading).toEqual(`${action.id}: ${action.description}`)
    expect(model.items[0].rules).toBeDefined()
    expect(model.items[0].rules.length).toEqual(1)
    expect(model.items[0].rules[0].id).toEqual(action.rules[0].id)
    expect(model.items[0].rules[0].description).toEqual(action.rules[0].description)
    expect(model.items[0].rules[0].enabled).toEqual(action.rules[0].enabled)
    expect(model.items[0].rules[0].facts[0].description).toEqual(action.rules[0].facts[0].description)
  })
})
