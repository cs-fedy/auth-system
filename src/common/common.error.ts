import { HttpMessages, HttpStatus, ErrorPayload } from '@custom-types'

export default class BaseError extends Error {
  public readonly statusCode: HttpStatus
  public readonly errorPayload: ErrorPayload
  public readonly isOperational: boolean

  constructor(
    statusCode: HttpStatus,
    message: HttpMessages,
    errorPayload: ErrorPayload,
    isOperational: boolean
  ) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)

    this.statusCode = statusCode
    this.errorPayload = errorPayload
    this.isOperational = isOperational
  }
}
