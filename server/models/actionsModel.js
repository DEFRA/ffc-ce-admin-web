const actionId = 'actionId'

function actionsModel (actions, errorMessage) {
  const items = actions.map(action => {
    return {
      heading: `${action.id}: ${action.description}`,
      actionID: action.id,
      preCheck: action['pre-check'],
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
