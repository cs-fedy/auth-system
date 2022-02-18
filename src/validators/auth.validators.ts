import Joi from 'joi'
import { password } from './custom.validation'

export default class AuthValidators {
  static createAccount = {
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().custom(password),
      fullName: Joi.string().required(),
    }).unknown(),
  }

  static login = {
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().custom(password),
    }).unknown(),
  }

  static confirmEmail = {
    body: Joi.object().keys({
      code: Joi.string().required(),
    }).unknown(),
  }

  static forgetPassword = {
    body: Joi.object().keys({
      email: Joi.string().required().email(),
    }).unknown(),
  }

  static resetPassword = {
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      code: Joi.string().required(),
      newPassword: Joi.string().required().custom(password),
    }).unknown(),
  }
}
