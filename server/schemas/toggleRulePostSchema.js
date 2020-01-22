const Joi = require('@hapi/joi')

module.exports = Joi.object({
  actionID: Joi.string().required(),
  ruleID: Joi.number().required(),
  update: Joi.boolean().required(),
  enabled: Joi.boolean().required()
})
