import express from 'express'
import { CommonRouteConfig } from '@common'
import { validate, AdminMiddlewares, UserMiddlewares, RoleMiddlewares } from '@middlewares'
import { adminValidators } from '@validators'
import { AdminControllers } from '@controllers'
import { catchAsync } from '@utils'
import RoleRoute from './role.route'

export default class UserRoute extends CommonRouteConfig {
  constructor(apiPath: string, middlewares: any[] | undefined = undefined) {
    super(express.Router(), apiPath, middlewares)
    this.router = this.configureRoutes()
  }

  getRoute(): express.Router {
    return this.router
  }

  configureRoutes(): express.Router {
    const adminRoute = this.configureMiddlewares(express.Router(), this.middlewares)

    // TODO: add permission checking middlewares

    adminRoute.post('/grantRole', [
      validate(adminValidators.grantRole),
      AdminMiddlewares.checkUserExist,
      RoleMiddlewares.checkRoleExist,
      catchAsync(AdminControllers.grantRole),
    ])

    adminRoute.delete('/revokeRole', [
      validate(adminValidators.revokeRole),
      AdminMiddlewares.checkUserExist,
      RoleMiddlewares.checkRoleExist,
      catchAsync(AdminControllers.revokeRole),
    ])

    adminRoute.post('/createUser', [
      validate(adminValidators.createUser),
      UserMiddlewares.checkUserExistByEmail,
      RoleMiddlewares.checkRoleExist,
      catchAsync(AdminControllers.createUser),
    ])

    const roleRoute = new RoleRoute('/roles', [])
    adminRoute.use('/', roleRoute.getRoute())
    return this.router.use(this.apiPath, adminRoute)
  }
}
