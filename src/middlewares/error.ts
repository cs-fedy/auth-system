import express from 'express'
import { BaseError } from '@common'

export default (
  err: BaseError,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { statusCode, message, errorPayload } = err

  const response = {
    code: statusCode,
    message,
    error: errorPayload,
  }

  res.status(statusCode).send(response)
}
