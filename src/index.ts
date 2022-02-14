import { logger, config } from '@configs'
import { mongo as connectDb } from '@db'
import app from '@root/app'

connectDb().then(() => {
  logger.info('connected to Mongodb 🥭')
  app.listen(config.port, () => {
    logger.info(`listening on port ${config.port} 🌎🚀`)
  })
})
