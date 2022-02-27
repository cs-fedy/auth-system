import express from 'express'
import { UserServices } from '@services'
import { errorTypes } from '@custom-types'

export default class AdminMiddlewares {
  static async checkUserExist(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const user = await UserServices.getUserById(req.body.userId)
    if (!user) next(new errorTypes.BadRequestError({ msg: 'bad request, user does not exist' }))

    next()
  }
}
