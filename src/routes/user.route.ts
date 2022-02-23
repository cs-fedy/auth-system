import express from 'express'
import { CommonRouteConfig } from '@common'
import { UserMiddlewares, validate } from '@middlewares'
import { userValidators } from '@validators'
import { UserControllers } from '@controllers'

export default class UserRoute extends CommonRouteConfig {
  constructor(apiPath: string, middlewares: any[] | undefined = undefined) {
    super(express.Router(), apiPath, middlewares)
    this.router = this.configureRoutes()
  }

  getRoute(): express.Router {
    return this.router
  }

  configureRoutes(): express.Router {
    const authenticatedUserRoute = this.configureMiddlewares(express.Router(), this.middlewares)
    const nonAuthenticatedUserRoute = this.configureMiddlewares(express.Router(), [])

    authenticatedUserRoute.patch('/:userId/firstName', [
      validate(userValidators.updateFirstName),
      UserControllers.updateFirstName,
    ])

    authenticatedUserRoute.patch('/:userId/LastName', [
      validate(userValidators.updateLastName),
      UserControllers.updateLastName,
    ])

    authenticatedUserRoute.patch('/:userId/password', [
      validate(userValidators.updatePassword),
      UserMiddlewares.checkUserPassword,
      UserControllers.updatePassword,
    ])

    authenticatedUserRoute.patch('/:userId/email', [
      validate(userValidators.updateEmail),
      UserMiddlewares.checkUserPassword,
      UserControllers.updateEmail,
    ])

    authenticatedUserRoute.post('/deactivate', [
      validate(userValidators.deactivateUser),
      UserMiddlewares.checkUserPassword,
      UserControllers.deactivateUserAccount,
    ])

    authenticatedUserRoute.delete('/:userId', [
      validate(userValidators.deleteAccount),
      UserMiddlewares.checkUserPassword,
      UserControllers.deleteAccount,
    ])

    nonAuthenticatedUserRoute.post('/activate', [
      validate(userValidators.activateUser),
      UserControllers.activateUserAccount,
    ])

    this.router.use(this.apiPath, authenticatedUserRoute)
    this.router.use(this.apiPath, nonAuthenticatedUserRoute)
    return this.router
  }
}
