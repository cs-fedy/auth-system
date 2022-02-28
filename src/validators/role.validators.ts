import Joi from 'joi'

export default class RoleValidators {
  static createRole = {
    body: Joi.object()
      .keys({
        name: Joi.string().required(),
      })
      .unknown(),
  }

  static grantRole = {
    body: Joi.object()
      .keys({
        userId: Joi.string().required(),
        roleId: Joi.string().required(),
      })
      .unknown(),
  }

  static revokeRole = {
    body: Joi.object()
      .keys({
        userId: Joi.string().required(),
        roleId: Joi.string().required(),
      })
      .unknown(),
  }

  static getRole = {
    params: Joi.object().keys({
      roleId: Joi.string().required(),
    }),
  }
}
