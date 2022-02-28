import express from 'express'
import { CommonRouteConfig } from '@common'
import { validate, UserMiddlewares, RoleMiddlewares } from '@middlewares'
import { adminValidators } from '@validators'
import { AdminControllers } from '@controllers'
import { catchAsync } from '@utils'
import RoleRoute from './role.route'
import ResourceRoute from './resource.route'

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

    adminRoute.post('/createUser', [
      UserMiddlewares.checkPermissions('users', { write: true }),
      validate(adminValidators.createUser),
      UserMiddlewares.checkUserExistByEmail,
      RoleMiddlewares.checkRoleExist,
      catchAsync(AdminControllers.createUser),
    ])

    const roleRoute = new RoleRoute('/roles', [])
    adminRoute.use('/', roleRoute.getRoute())

    const resourceRoute = new ResourceRoute('/resources', [])
    adminRoute.use('/', resourceRoute.getRoute())

    return this.router.use(this.apiPath, adminRoute)
  }
}
