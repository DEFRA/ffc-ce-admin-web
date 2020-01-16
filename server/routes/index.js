const routes = [].concat(
  require('./home'),
  require('./actions'),
  require('./healthy'),
  require('./healthz'),
  require('./public')
)
module.exports = routes
