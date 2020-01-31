const actionId = 'actionId'

function actionsModel (actions, errorMessage) {
  const items = actions.map(action => {
    return {
      heading: action.description,
      actionID: action.id,
      rules: action.rules
    }
  })
  return {
    id: actionId,
    items,
    errorMessage: errorMessage || ''
  }
}

module.exports = actionsModel
