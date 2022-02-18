import * as AuthTypes from './auth.types'
import HttpMessages from './httpMessages.types'
import HttpStatus from './httpStatus.types'
import * as errorTypes from './error.types'

type ErrorPayload = { [index: string]: string }

export { AuthTypes, HttpMessages, HttpStatus, errorTypes, ErrorPayload }
