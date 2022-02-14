import Joi from 'joi'
import { password } from './custom.validation'

export default class AuthValidators {
  static createAccount = {
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().custom(password),
      fullName: Joi.string().required(),
    }),
  }

  static login = {
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().custom(password),
    }),
  }

  static confirmEmail = {
    body: Joi.object().keys({
      code: Joi.string().required(),
    }),
  }
}
