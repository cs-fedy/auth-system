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
      next(new errorTypes.BadRequestError({ msg: 'user already exist, check your credentials' }))
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

  static async checkUserPassword(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const { password: oldPassword, user } = req.body
    const isSame = await hash.compare(oldPassword, user.password)
    if (isSame) next()
    else
      next(new errorTypes.BadRequestError({ msg: 'cannot be authorized, check your credentials' }))
  }

  static checkRole(roleName: string) {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const roles = req.body.authPayload.roles as roleModel.Role[]
      const targetRole = roles.find((role) => role.name === roleName)
      if (!targetRole)
        next(
          new errorTypes.UnauthorizedRequest({
            msg: `cannot be authorized, you are not an ${roleName}`,
          })
        )

      Object.assign(req.body, { targetRole })
      next()
    }
  }

  static checkPermissions(resourceName: string, permissions: any) {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const { targetRole } = req.body
      const resources = targetRole.resources as resourceModel.Resource[]
      const resource = resources.find((resource) => resource.name === resourceName)
      if (
        !resource ||
        !_.isEqual(permissions, _.pick(resource.permissions, Object.keys(permissions)))
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
