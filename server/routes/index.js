const routes = [].concat(
  require('./home'),
  require('./payment'),
  require('./healthy'),
  require('./healthz'),
  require('./public')
)
module.exports = routes
