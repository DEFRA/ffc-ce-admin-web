const routes = [].concat(
  require('./home'),
  require('./action'),
  require('./healthy'),
  require('./healthz'),
  require('./public')
)
module.exports = routes
