
function checkActionSucceeds (payload) {
  if (payload !== undefined) {
    if (payload.makeActionFail !== undefined) {
      return false
    }
  }
  return true
}

function performAction (payload) {
  return { success: checkActionSucceeds(payload) }
}

module.exports = { performAction }
