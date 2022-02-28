import express from 'express'
import { errorTypes } from '@custom-types'
import { DAORole } from '@models'

export default class RoleMiddlewares {
  static async checkRoleExist(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const role = await DAORole.getRoleById(req.body.roleId)
    if (!role) next(new errorTypes.BadRequestError({ msg: 'bad request, role does not exist' }))

    Object.assign(req.body, { role })
    next()
  }

  static async checkRoleDoesNotExist(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const role = await DAORole.getRole({ name: req.body.name })
    if (role) next(new errorTypes.BadRequestError({ msg: 'bad request, role already exist' }))
    next()
  }
}
