import express from 'express'
import { HttpStatus, HttpMessages } from '@custom-types'
import { config, logger } from '@configs'
import { ApiError } from '@utils'

export default (
  err: ApiError,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  let { statusCode, message } = err
  const { errorPayload } = err
  if (config.env === 'production' && !err.isOperational) {
    statusCode = HttpStatus.INTERNAL_SERVER_ERROR
    message = HttpMessages.H500
  }

  res.locals.errorMessage = err.message

  const response = {
    code: statusCode,
    message,
    error: errorPayload,
  }

  if (config.env === 'development') {
    logger.error(err)
  }

  res.status(statusCode).send(response)
}
