import express from 'express'
import jwt from 'jsonwebtoken'
import { AuthServices } from '@services'
import { ApiError, hash } from '@utils'
import { HttpStatus, HttpMessages } from '@custom-types'
import { config, tokens } from '@configs'
import {redis} from '@db'
import { rateModels } from '@models'

export default class AuthMiddlewares {
  static async checkUserDoesNotExist(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (await AuthServices.getUserByEmail(req.body.email))
      next(
        new ApiError(HttpStatus.BAD_REQUEST, HttpMessages.H400, {
          msg: 'user already exist check your credentials',
        })
      )

    next()
  }

  static async checkUserExistByEmail(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const user = await AuthServices.getUserByEmail(req.body.email)
    if (!user) {
      await rateModels.loginLimiterByIP.consume(req.ip)
      next(
        new ApiError(HttpStatus.BAD_REQUEST, HttpMessages.H400, {
          msg: 'cannot be authorized, check your credentials',
        })
      )
    }

    Object.assign(req.body, { user })
    next()
  }

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

      next(
        new ApiError(HttpStatus.BAD_REQUEST, HttpMessages.H400, {
          msg: 'cannot be authorized, check your credentials',
        })
      )
    }

    next()
  }

  static async checkUserExist(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const user = await AuthServices.getUserById(req.body.authPayload.userId)
    if (!user)
      next(
        new ApiError(HttpStatus.BAD_REQUEST, HttpMessages.H400, {
          msg: 'cannot be authorized, user does not exist',
        })
      )

    Object.assign(req.body, { user })
    next()
  }

  static auth() {
    return async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      const authHeader = req.headers.authorization || ''
      if (!authHeader)
        next(
          new ApiError(HttpStatus.BAD_REQUEST, HttpMessages.H400, {
            msg: 'Authorization header must be provided',
          })
        )

      const token = authHeader.split('Bearer ')[1]
      if (!token)
        next(
          new ApiError(HttpStatus.BAD_REQUEST, HttpMessages.H400, {
            msg: 'Authorization token must be: Bearer [token]',
          })
        )

      let payload = { accessToken: token, userId: '', exp: 0 }
      jwt.verify(token, config.jwt.secret, (err: any, result: any) => {
        const jwtPayload = result as jwt.JwtPayload
        if (err)
          next(
            new ApiError(HttpStatus.BAD_REQUEST, HttpMessages.H400, {
              msg: 'Invalid/Expired token',
            })
          )

        const { userId, exp } = jwtPayload
        //* check if token is black listed or not
        redis.get(`${tokens.ACCESS}_${userId}`, (err, res) => {
          if (err)
            next(
              new ApiError(
                HttpStatus.INTERNAL_SERVER_ERROR,
                HttpMessages.H500,
                {
                  msg: 'Error while validating the JWT',
                }
              )
            )
          if (res) {
            res = JSON.parse(res)
            if (res && res.includes(token))
              next(
                new ApiError(HttpStatus.BAD_REQUEST, HttpMessages.H500, {
                  msg: 'Token is black listed',
                })
              )
          }
        })
        payload = { ...payload, userId, exp: exp || 0 }
      })

      Object.assign(req.body, { authPayload: payload })
      next()
    }
  }

  static async checkRefreshToken(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const token = await AuthServices.getRefreshToken(
      req.cookies[tokens.REFRESH]
    )
    if (token?.isDeleted)
      next(
        new ApiError(HttpStatus.BAD_REQUEST, HttpMessages.H400, {
          msg: 'invalid or expired refresh token',
        })
      )

    const expiresIn = token?.expiresIn as Date
    if (expiresIn < new Date(Date.now()))
      next(
        new ApiError(HttpStatus.BAD_REQUEST, HttpMessages.H400, {
          msg: 'invalid or expired token',
        })
      )

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
    else if (
      limitEmailIP &&
      limitEmailIP?.consumedPoints > config.maxWrongAttemptsByEmailIPPerHour
    )
      retrySeconds = Math.round(limitEmailIP.msBeforeNext / 1000) || 1

    if (retrySeconds <= 0) next()
    return res
      .set('Retry-After', String(retrySeconds))
      .status(429)
      .json({
        status: 429,
        error: {
          msg: `Too many requests. Retry after ${retrySeconds} seconds.`,
        },
      })
  }

  static async checkConfirmCode(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const code = req.body.code as string
    const email = req.body.user.code as string
    redis.get(`${tokens.VERIFY_EMAIL}_${email}`, (err, result) => {
      if (err)
        next(
          new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, HttpMessages.H500, {
            msg: 'Error while validating the JWT',
          })
        )

      if (result === code) next()

      next(
        new ApiError(HttpStatus.BAD_REQUEST, HttpMessages.H400, {
          msg: 'invalid verification code',
        })
      )
    })
  }
}
