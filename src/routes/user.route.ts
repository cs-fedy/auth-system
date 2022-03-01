import express from 'express'
import { CommonRouteConfig } from '@common'
import { UserMiddlewares, validate } from '@middlewares'
import { userValidators } from '@validators'
import { UserControllers } from '@controllers'
import { catchAsync } from '@utils'

export default class UserRoute extends CommonRouteConfig {
  constructor(apiPath: string, middlewares: any[] | undefined = undefined) {
    super(express.Router(), apiPath, middlewares)
    this.router = this.configureRoutes()
  }

  getRoute(): express.Router {
    return this.router
  }

  configureRoutes(): express.Router {
    const userRoute = this.configureMiddlewares(express.Router(), this.middlewares)

    userRoute.patch('/firstName', [
      UserMiddlewares.checkPermissions('self', { update: true }),
      validate(userValidators.updateFirstName),
      catchAsync(UserControllers.updateFirstName),
    ])

    userRoute.patch('/LastName', [
      UserMiddlewares.checkPermissions('self', { update: true }),
      validate(userValidators.updateLastName),
      catchAsync(UserControllers.updateLastName),
    ])

    userRoute.patch('/password', [
      UserMiddlewares.checkPermissions('self', { update: true }),
      validate(userValidators.updatePassword),
      UserMiddlewares.checkUserPassword,
      catchAsync(UserControllers.updatePassword),
    ])

    userRoute.patch('/email', [
      UserMiddlewares.checkPermissions('self', { update: true }),
      validate(userValidators.updateEmail),
      UserMiddlewares.checkUserPassword,
      catchAsync(UserControllers.updateEmail),
    ])

    return this.router.use(this.apiPath, userRoute)
  }
}
