import Joi from 'joi'
import { password } from './custom.validation'

export default class AdminValidators {
  static createUser = {
    body: Joi.object()
      .keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().custom(password),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        roleId: Joi.string().required(),
      })
      .unknown(),
  }
}
