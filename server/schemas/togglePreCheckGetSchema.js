const Joi = require('@hapi/joi')

module.exports = Joi.object({
  actionID: Joi.string().required(),
  actionDescription: Joi.string().required()
})
