import Joi from 'joi'

export default class RoleValidators {
  static createRole = {
    body: Joi.object()
      .keys({
        name: Joi.string().required(),
      })
      .unknown(),
  }

  static createResource = {
    body: Joi.object()
      .keys({
        name: Joi.string().required(),
        permissions: Joi.object().keys({
          read: Joi.boolean().required(),
          write: Joi.boolean().required(),
          update: Joi.boolean().required(),
          delete: Joi.boolean().required(),
        }),
      })
      .unknown(),
  }

  static assignResource = {
    body: Joi.object()
      .keys({
        roleId: Joi.string().required(),
        resourceId: Joi.string().required(),
      })
      .unknown(),
  }
}
