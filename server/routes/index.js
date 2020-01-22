const routes = [].concat(
  require('./actions'),
  require('./healthy'),
  require('./healthz'),
  require('./home'),
  require('./public'),
  require('./toggle-rule')
)
module.exports = routes
