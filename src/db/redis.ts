import Redis from 'ioredis'
import { config, logger } from '@configs'

const redis = new Redis({
  port: config.db.redis.port,
  host: config.db.redis.host,
})

redis.on('error', (error: string) => {
  logger.error('Redis connection error', error)
})

export default redis
