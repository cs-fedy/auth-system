import express from 'express'
import { AuthServices } from '@services'
import { HttpStatus } from '@custom-types'
import { tokens } from '@configs'
import { cookiesOptions } from '@utils'

export default class AuthControllers {
  static async createAccount(req: express.Request, res: express.Response) {
    const payload = await AuthServices.createAccount(req.body)
    return res.status(HttpStatus.CREATED).json({
      status: HttpStatus.CREATED,
      data: payload,
    })
  }

  static async login(req: express.Request, res: express.Response) {
    const { id: userId } = req.body.user
    const { access, refresh } = await AuthServices.generateTokens(userId)
    await AuthServices.createRefreshToken(refresh, userId)
    res.cookie(tokens.REFRESH, refresh.token, cookiesOptions)
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: {
        token: access,
      },
    })
  }

  static async logout(req: express.Request, res: express.Response) {
    await AuthServices.deleteRefreshToken(req.cookies[tokens.REFRESH])
    AuthServices.blackListAccessToken(req.body.authPayload)
    res.clearCookie(tokens.REFRESH)
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: {
        msg: 'logged out successfully',
      },
    })
  }

  static async refreshToken(req: express.Request, res: express.Response) {
    const { id: userId } = req.body.user
    const { refreshToken: oldRefreshToken } = req.body.authPayload
    const { access, refresh: newRefreshToken } =
      await AuthServices.generateTokens(userId)
    await AuthServices.updateRefreshToken(oldRefreshToken, newRefreshToken)
    res.cookie(tokens.REFRESH, newRefreshToken.token, cookiesOptions)
    return res.status(HttpStatus.CREATED).json({
      status: HttpStatus.CREATED,
      data: {
        token: access,
      },
    })
  }

  static async verifyEmail(req: express.Request, res: express.Response) {
    const payload = await AuthServices.verifyEmail(req.body.user.email)
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: payload,
    })
  }

  static async confirmEmail(req: express.Request, res: express.Response) {
    const payload = await AuthServices.confirmEmail(req.body.user.email)
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: payload,
    })
  }
}
