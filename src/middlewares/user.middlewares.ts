import express from 'express'
import { errorTypes } from '@custom-types'
import { UserServices } from '@services'
import { rateModels } from '@models'
import { hash } from '@utils'
import { roleModel, resourceModel } from '@models'
import _ from 'lodash'

export default class UserMiddlewares {
  static async checkUserDoesNotExist(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (await UserServices.getUserByEmail(req.body.email))
      next(new errorTypes.BadRequestError({ msg: 'user already exist check your credentials' }))

    next()
  }

  static async checkUserExistByEmail(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const user = await UserServices.getUserByEmail(req.body.email)
    if (!user) {
      await rateModels.loginLimiterByIP.consume(req.ip)
      next(new errorTypes.BadRequestError({ msg: 'cannot be authorized, check your credentials' }))
    }

    Object.assign(req.body, { user })
    next()
  }

  static async checkUserExist(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const user = await UserServices.getUserById(req.body.authPayload.userId)
    if (!user)
      next(new errorTypes.BadRequestError({ msg: 'cannot be authorized, user does not exist' }))

    Object.assign(req.body, { user })
    next()
  }

  static async checkAccessAbility(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const { activated, isDeleted, verified } = req.body.user
    if (!activated || isDeleted || !verified)
      next(new errorTypes.UnauthorizedRequest({ msg: 'check your account status' }))
    else next()
  }

  static async checkUserPassword(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const { password: oldPassword, user } = req.body
    const isSame = await hash.compare(oldPassword, user.password)
    if (!isSame) next()
    else
      next(new errorTypes.BadRequestError({ msg: 'cannot be authorized, check your credentials' }))
  }

  static async checkAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
    const roles = req.body.authPayload.roles as roleModel.Role[]
    const adminRole = roles.find((role) => role.name === 'admin')
    if (!adminRole)
      next(
        new errorTypes.UnauthorizedRequest({ msg: 'cannot be authorized, you are not an admin' })
      )

    Object.assign(req.body, { adminRole })
    next()
  }

  static checkPermissions(resourceName: string, permissions: any) {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const {
        adminRole: { name, permissions: adminPermissions },
      } = req.body
      if (
        resourceName !== name ||
        _.isEqual(permissions, _.pick(adminPermissions, permissions.keys()))
      )
        next(
          new errorTypes.UnauthorizedRequest({
            msg: 'cannot be authorized, you do not have the right to operate on this resource',
          })
        )

      next()
    }
  }
}
