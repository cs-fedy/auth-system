import express from 'express'
import { CommonRouteConfig } from '@common'
import { roleValidators } from '@validators'
import { validate, RoleMiddlewares } from '@middlewares'
import { RoleControllers } from '@controllers'
import { catchAsync } from '@utils'

export default class RoleRoute extends CommonRouteConfig {
  constructor(apiPath: string, middlewares: any[] | undefined = undefined) {
    super(express.Router(), apiPath, middlewares)
    this.router = this.configureRoutes()
  }

  getRoute(): express.Router {
    return this.router
  }

  configureRoutes(): express.Router {
    const roleRoute = this.configureMiddlewares(express.Router(), this.middlewares)

    // TODO: add permission checking middlewares
    // TODO: get role route
    // TODO: get roles route
    // TODO: get resources route

    roleRoute.post('/', [
      validate(roleValidators.createRole),
      RoleMiddlewares.checkRoleDoesNotExist,
      catchAsync(RoleControllers.createRole),
    ])

    roleRoute.post('/resource', [
      validate(roleValidators.createResource),
      RoleMiddlewares.checkResourceDoesNotExist,
      catchAsync(RoleControllers.createResource),
    ])

    roleRoute.post('/assignResource', [
      validate(roleValidators.assignResource),
      RoleMiddlewares.checkRoleExist,
      RoleMiddlewares.checkResourceExist,
      catchAsync(RoleControllers.assignResource),
    ])

    return this.router.use(this.apiPath, roleRoute)
  }
}
