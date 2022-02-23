import express from 'express'
import { HttpStatus } from '@custom-types'
import { UserServices } from '@services'
import { AuthServices } from '@services'

export default class UserControllers {
  static async updateFirstName(req: express.Request, res: express.Response) {
    const payload = await UserServices.updateFirstName(req.params.userId, req.body.firstName)
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: {
        oldFirstName: req.body.user.firstName,
        newFirstName: payload?.firstName || '',
      },
    })
  }

  static async updateLastName(req: express.Request, res: express.Response) {
    const payload = await UserServices.updateLastName(req.params.userId, req.body.lastName)
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: {
        oldLastName: req.body.user.lastName,
        newLastName: payload?.lastName || '',
      },
    })
  }

  static async deactivateUserAccount(req: express.Request, res: express.Response) {
    const payload = await UserServices.deactivateUser(req.body.user.id)
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: {
        userId: req.body.user.id,
        accountStatus: payload?.activated ? 'activated' : 'deactivated',
      },
    })
  }

  static async activateUserAccount(req: express.Request, res: express.Response) {
    const payload = await UserServices.activateUser(req.body.user.id)
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: {
        userId: req.body.user.id,
        accountStatus: payload?.activated ? 'activated' : 'deactivated',
      },
    })
  }

  static async deleteAccount(req: express.Request, res: express.Response) {
    const payload = await UserServices.deleteAccount(req.params.userId)
    return res.status(HttpStatus.NO_CONTENT).json({
      status: HttpStatus.NO_CONTENT,
      data: {
        userId: req.body.user.id,
        accountStatus: payload?.isDeleted ? 'deleted' : 'active',
      },
    })
  }

  static async updatePassword(req: express.Request, res: express.Response) {
    const {
      user: { id: userId, email },
      newPassword,
    } = req.body
    // TODO: fix this call
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
}
