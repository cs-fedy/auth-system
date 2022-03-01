import Joi from 'joi'
import { password } from './custom.validation'

export default class UserValidators {
  static updateFirstName = {
    body: Joi.object()
      .keys({
        firstName: Joi.string().required(),
      })
      .unknown(),
  }

  static updateLastName = {
    body: Joi.object()
      .keys({
        lastName: Joi.string().required(),
      })
      .unknown(),
  }

  static deleteAccount = {
    body: Joi.object()
      .keys({
        password: Joi.string().required().custom(password),
      })
      .unknown(),
  }

  static updatePassword = {
    body: Joi.object()
      .keys({
        password: Joi.string().required().custom(password),
        newPassword: Joi.string().required().custom(password),
      })
      .unknown(),
  }

  static updateEmail = {
    body: Joi.object()
      .keys({
        password: Joi.string().required().custom(password),
        newEmail: Joi.string().required().email(),
      })
      .unknown(),
  }
}
