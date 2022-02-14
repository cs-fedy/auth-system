export default class ApiError extends Error {
  statusCode: number
  errorPayload: object
  isOperational: boolean

  constructor(
    statusCode: number,
    message: string,
    errorPayload = {},
    isOperational = true
  ) {
    super(message)
    this.statusCode = statusCode
    this.errorPayload = errorPayload
    this.isOperational = isOperational
  }
}
