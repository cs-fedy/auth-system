import Joi from 'joi'

export const objectId = (value: string, helpers: Joi.CustomHelpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message({ msg: '"{{#label}}" must be a valid mongo id' })
  }
  return value
}

export const password = (value: string, helpers: Joi.CustomHelpers) => {
  if (value.length < 8) {
    return helpers.message({ msg: 'password must be at least 8 characters' })
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message({
      msg: 'password must contain at least 1 letter and 1 number',
    })
  }
  return value
}
