import express from 'express'
import jwt from 'jsonwebtoken'
import { AuthServices } from '@services'
import { hash } from '@utils'
import { HttpStatus, HttpMessages, errorTypes } from '@custom-types'
import { config, tokens } from '@configs'
import { redis } from '@db'
import { rateModels } from '@models'

export default class AuthMiddlewares {
  static async checkPasswordIsValid(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const { password, user } = req.body
    const isSame = await hash.compare(password, user.password)
    if (!isSame) {
      await Promise.all([
        rateModels.loginLimiterByIP.consume(req.ip),
        rateModels.loginLimiterByEmailIP.consume(`${req.body.email}_${req.ip}`),
      ])

      next(new errorTypes.BadRequestError({ msg: 'cannot be authorized, check your credentials' }))
    }

    next()
  }

  static async auth(req: express.Request, res: express.Response, next: express.NextFunction) {
    const authHeader = req.headers.authorization || ''
    if (!authHeader)
      next(new errorTypes.BadRequestError({ msg: 'Authorization header must be provided' }))

    const token = authHeader.split('Bearer ')[1]
    if (!token)
      next(new errorTypes.BadRequestError({ msg: 'Authorization token must be: Bearer [token]' }))

    let payload = { accessToken: token, userId: '', roles: [], exp: 0 }
    try {
      const { userId, roles, exp } = jwt.verify(token, config.jwt.secret) as jwt.JwtPayload
      payload = { ...payload, userId, roles, exp: exp || 0 }
    } catch (err) {
      next(new errorTypes.BadRequestError({ msg: 'Invalid/Expired token' }))
    }

    //* check if token is black listed or not
    try {
      let parsedResult: { [x: string]: number } = {}
      const result = (await redis.get(`${tokens.ACCESS}_${payload.userId}`)) as string
      if (res) {
        parsedResult = JSON.parse(result as string)
        if (parsedResult && (parsedResult['all_invalidated'] === 1 || parsedResult[token])) {
          next(new errorTypes.BadRequestError({ msg: 'Token is black listed' }))
        }
      }
    } catch (error) {
      next(new errorTypes.InternalServerError())
    }

    Object.assign(req.body, { authPayload: payload })
    next()
  }

  static async checkRefreshToken(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const token = await AuthServices.getRefreshToken(req.cookies[tokens.REFRESH])
    if (!token) next(new errorTypes.BadRequestError({ msg: 'invalid or expired refresh token' }))

    const expiresIn = token?.expiresIn as Date
    if (expiresIn < new Date(Date.now()))
      next(new errorTypes.BadRequestError({ msg: 'invalid or expired token' }))

    const authPayload = { userId: token?.owner, refreshToken: token?.token }
    Object.assign(req.body, { authPayload })
    next()
  }

  static async rateLimiter(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const IPAddress = req.ip
    const [limitIP, limitEmailIP] = await Promise.all([
      rateModels.loginLimiterByIP.get(IPAddress),
      rateModels.loginLimiterByEmailIP.get(`${req.body.email}_${IPAddress}`),
    ])

    let retrySeconds = 0
    if (limitIP && limitIP?.consumedPoints > config.maxWrongAttemptsByIPPerDay)
      retrySeconds = Math.round(limitIP.msBeforeNext / 1000) || 1
    else if (limitEmailIP && limitEmailIP?.consumedPoints > config.maxWrongAttemptsByEmailIPPerHour)
      retrySeconds = Math.round(limitEmailIP.msBeforeNext / 1000) || 1

    if (retrySeconds <= 0) next()
    else {
      res
        .set('Retry-After', String(retrySeconds))
        .status(HttpStatus.TOO_MANY_REQUESTS)
        .json({
          status: HttpStatus.TOO_MANY_REQUESTS,
          message: HttpMessages.H429,
          errors: { msg: `Too many requests. Retry after ${retrySeconds} seconds.` },
        })
    }
  }

  static async checkCode(req: express.Request, res: express.Response, next: express.NextFunction) {
    const code = req.body.code as string
    const email = req.body.email || (req.body.user.email as string)
    try {
      const result = await redis.get(`${tokens.VERIFY_EMAIL}_${email}`)
      if (code.localeCompare(result as string) === 0) next()
      else next(new errorTypes.BadRequestError({ msg: 'invalid verification code' }))
    } catch (error) {
      next(new errorTypes.InternalServerError())
    }
  }
}
