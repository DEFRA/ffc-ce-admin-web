const Joi = require('@hapi/joi')

// Define config schema
const schema = Joi.object({
  port: Joi.number().default(3000),
  env: Joi.string().valid('development', 'test', 'production').default('development'),
  staticCacheTimeoutMillis: Joi.number().default(15 * 60 * 1000),
  restClientTimeoutMillis: Joi.number().default(20000),
  paymentUrl: Joi.string().uri().required(),
  // Caching
  cookieTimeout: Joi.number().min(60000).default(10800000),
  cookiePassword: Joi.string().min(32).required()
})

// Build config
const config = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  staticCacheTimeoutMillis: process.env.STATIC_CACHE_TIMEOUT_IN_MILLIS,
  restClientTimeoutMillis: process.env.REST_CLIENT_TIMEOUT_IN_MILLIS,
  paymentUrl: process.env.PAYMENT_URL,
  cookiePassword: process.env.COOKIE_PASSWORD
}

// Validate config
const result = schema.validate(config, {
  abortEarly: false
})

// Throw if config is invalid
if (result.error) {
  throw new Error(`The server config is invalid. ${result.error.message}`)
}

// Use the Joi validated value
const value = result.value

// Add some helper props
value.isDev = (value.env === 'development' || value.env === 'test')
value.isTest = value.env === 'test'
value.isProd = value.env === 'production'

// Build cookie options
value.cookieOptions = {
  // ttl: null, // 'null' will delete the cookie when the browser is closed
  isSecure: value.isProd, // Secure in production
  password: value.cookiePassword,
  isHttpOnly: true,
  clearInvalid: true,
  strictHeader: true
}
module.exports = value
