import express from 'express'
import { DAOResource } from '@models'
import { errorTypes } from '@custom-types'

export default class ResourceMiddlewares {
  static async checkResourceDoesNotExist(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const role = await DAOResource.getResource({ name: req.body.name })
    if (role) next(new errorTypes.BadRequestError({ msg: 'bad request, resource already exist' }))
    next()
  }

  static async checkResourceExist(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const resource = await DAOResource.getResource({ name: req.body.name })
    if (!resource)
      next(new errorTypes.BadRequestError({ msg: 'bad request, resource does not exist' }))

    Object.assign(req.body, { resource })
    next()
  }
}
