import { logger, config } from '@configs'
import { mongo as connectDb } from '@db'
import app from '@root/app'
import { Server } from 'http'

let server: Server
connectDb().then(() => {
  logger.info('connected to Mongodb 🥭')
  server = app.listen(config.port, () => {
    logger.info(`listening on port ${config.port} 🌎🚀`)
  })
})

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed')
      process.exit(1)
    })
  } else {
    process.exit(1)
  }
}

const unexpectedErrorHandler = (error: string) => {
  logger.error(error)
  exitHandler()
}

process.on('uncaughtException', unexpectedErrorHandler)
process.on('unhandledRejection', unexpectedErrorHandler)

process.on('SIGTERM', () => {
  logger.info('SIGTERM received')
  if (server) {
    server.close()
  }
  process.exit(0)
})

process.on('SIGINT', () => {
  logger.info('Process has been interrupted')
  if (server) {
    server.close()
  }
  process.exit(0)
})
