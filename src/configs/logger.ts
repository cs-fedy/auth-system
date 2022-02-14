import winston from 'winston'
import { config } from '@configs'

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack })
  }
  return info
})

class Logger {
  private logger: winston.Logger
  private static instance: Logger

  constructor() {
    this.logger = winston.createLogger({
      level: config.env === 'development' ? 'debug' : 'info',
      format: winston.format.combine(
        enumerateErrorFormat(),
        config.env === 'development'
          ? winston.format.colorize()
          : winston.format.uncolorize(),
        winston.format.splat(),
        winston.format.printf(({ level, message }) => `${level}: ${message}`)
      ),
      transports: [
        new winston.transports.Console({
          stderrLevels: ['error'],
        }),
      ],
    })
  }

  public static getLoggerInstance() {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  public static getLogger() {
    const _logger = Logger.getLoggerInstance()
    return _logger.logger
  }
}

export default Logger.getLogger()