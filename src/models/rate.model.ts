import { RateLimiterRedis } from 'rate-limiter-flexible'
import { redis } from '@db'
import { config } from '@configs'

export const loginLimiterByIP = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: 'login_fail_ip_per_day',
  points: config.maxWrongAttemptsByIPPerDay,
  duration: 60 * 60 * 24,
  blockDuration: 60 * 60 * 24,
})

export const loginLimiterByEmailIP = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: 'login_fail_email_ip_per_hour',
  points: config.maxWrongAttemptsByEmailIPPerHour,
  duration: 60 * 60,
  blockDuration: 60 * 60,
})
