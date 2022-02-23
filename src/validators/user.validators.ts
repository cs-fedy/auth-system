import Joi from 'joi'
import { password } from './custom.validation'

export default class UserValidators {
  static updateFirstName = {
    body: Joi.object()
      .keys({
        firstName: Joi.string().required(),
      })
      .unknown(),
    params: Joi.object().keys({
      userId: Joi.string().required(),
    }),
  }

  static updateLastName = {
    body: Joi.object()
      .keys({
        lastName: Joi.string().required(),
      })
      .unknown(),
    params: Joi.object().keys({
      userId: Joi.string().required(),
    }),
  }

  static deactivateUser = {
    body: Joi.object()
      .keys({
        password: Joi.string().required().custom(password),
      })
      .unknown(),
  }

  static activateUser = {
    body: Joi.object()
      .keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().custom(password),
      })
      .unknown(),
  }

  static deleteAccount = {
    body: Joi.object()
      .keys({
        password: Joi.string().required().custom(password),
      })
      .unknown(),
    params: Joi.object().keys({
      userId: Joi.string().required(),
    }),
  }

  static updatePassword = {
    body: Joi.object()
      .keys({
        password: Joi.string().required().custom(password),
        newPassword: Joi.string().required().custom(password),
      })
      .unknown(),
    params: Joi.object().keys({
      userId: Joi.string().required(),
    }),
  }

  static updateEmail = {
    body: Joi.object()
      .keys({
        password: Joi.string().required().custom(password),
        newEmail: Joi.string().required().email(),
      })
      .unknown(),
    params: Joi.object().keys({
      userId: Joi.string().required(),
    }),
  }
}
