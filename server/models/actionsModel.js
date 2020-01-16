const actionId = 'actionId'

function actionsModel (actions, errorMessage) {
  const items = actions.map(action => {
    return {
      heading: `${action.id}: ${action.description}`,
      rules: action.rules
    }
  })
  return {
    id: actionId,
    items
  }
}

module.exports = actionsModel
