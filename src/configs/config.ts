import dotenv from 'dotenv'
import path from 'path'
import Joi from 'joi'

dotenv.config({ path: path.join(__dirname, '../../.env') })

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid('production', 'development', 'test')
      .default('development'),
    PORT: Joi.number().default(3000),
    BASE_URL: Joi.string().default('http://localhost:3000'),
    SALT_ROUND: Joi.number().default(12),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    MONGODB_USER: Joi.string().required().description('Mongo DB username'),
    MONGODB_PASS: Joi.string().required().description('Mongo DB password'),
    REDIS_PORT: Joi.string().required().description('Redis cache port'),
    REDIS_HOST: Joi.string().required().description('Redis cache host'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    MAX_WRONG_ATTEMPTS_BY_IP_PER_DAY: Joi.number().default(100),
    MAX_WRONG_ATTEMPTS_BY_EMAIL_IP_PER_HOUR: Joi.number().default(10),
    SENDGRID_API_KEY: Joi.string().required().description('send_grid api key'),
  })
  .unknown()

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env)

if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  baseUrl: envVars.BASE_URL,
  saltRound: envVars.SALT_ROUND,
  db: {
    mongo: {
      url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
      user: envVars.MONGODB_USER,
      pass: envVars.MONGODB_PASS,
    },
    redis: {
      port: envVars.REDIS_PORT,
      host: envVars.REDIS_HOST,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes:
      envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  maxWrongAttemptsByIPPerDay: envVars.MAX_WRONG_ATTEMPTS_BY_IP_PER_DAY,
  maxWrongAttemptsByEmailIPPerHour:
    envVars.MAX_WRONG_ATTEMPTS_BY_EMAIL_IP_PER_HOUR,
  sendGridApiKey: envVars.SENDGRID_API_KEY,
}
