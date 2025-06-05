import express from 'express'
import { HttpStatus } from '@custom-types'
import { UserServices } from '@services'
import { AuthServices } from '@services'

export default class UserControllers {
  // Update handlers rely on ORM update methods. Ensure the new document is returned
  //!--------------
  static async updateFirstName(req: express.Request, res: express.Response) {
    const payload = await UserServices.updateFirstName(req.body.user.id, req.body.firstName)
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: {
        oldFirstName: req.body.user.firstName,
        newFirstName: payload.firstName,
      },
    })
  }

  static async updateLastName(req: express.Request, res: express.Response) {
    const payload = await UserServices.updateLastName(req.body.user.id, req.body.lastName)
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: {
        oldLastName: req.body.user.lastName,
        newLastName: payload.lastName,
      },
    })
  }

  static async updatePassword(req: express.Request, res: express.Response) {
    const {
      user: { id: userId, email },
      newPassword,
    } = req.body
    await UserServices.updatePassword(userId, newPassword)
    await AuthServices.clearRefreshTokens(req.body.user.id)
    await AuthServices.invalidateAccessTokens(email)
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: { msg: 'password changed successfully' },
    })
  }

  static async updateEmail(req: express.Request, res: express.Response) {
    const {
      user: { id: userId, email: oldEmail },
      newEmail,
    } = req.body
    await UserServices.updateEmail(userId, oldEmail, newEmail)
    await AuthServices.clearRefreshTokens(req.body.user.id)
    await AuthServices.invalidateAccessTokens(oldEmail)
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: { msg: 'email changed successfully' },
    })
  }
  //!--------------
}
