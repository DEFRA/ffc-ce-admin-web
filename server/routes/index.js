const routes = [].concat(
  require('./actions'),
  require('./healthy'),
  require('./healthz'),
  require('./home'),
  require('./public')
)
module.exports = routes
