const routes = [].concat(
  require('./actions'),
  require('./healthy'),
  require('./healthz'),
  require('./home'),
  require('./public'),
  require('./toggle-pre-check'),
  require('./toggle-rule')
)
module.exports = routes
