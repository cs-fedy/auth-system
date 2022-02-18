import express from 'express'
import morgan from 'morgan'
import { config, logger } from '@configs'

morgan.token('message', function (req, res) { return res.statusMessage })
const getIpFormat = () => (config.env === 'production' ? ':remote-addr - ' : '')
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`

export const successHandler = morgan(successResponseFormat, {
  skip: (req: express.Request, res: express.Response) => res.statusCode >= 400,
  stream: { write: (message: string) => logger.info(message.trim()) },
})

export const errorHandler = morgan(errorResponseFormat, {
  skip: (req: express.Request, res: express.Response) => res.statusCode < 400,
  stream: { write: (msg: string) => logger.error(msg.trim()) },
})