import express from 'express'
import { CommonRouteConfig } from '@common'
import { roleValidators } from '@validators'
import { validate, RoleMiddlewares, AdminMiddlewares, UserMiddlewares } from '@middlewares'
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

    roleRoute.get('/', [
      UserMiddlewares.checkPermissions('roles', { read: true }),
      catchAsync(RoleControllers.listRoles),
    ])

    roleRoute.get('/:roleId', [
      UserMiddlewares.checkPermissions('roles', { read: true }),
      validate(roleValidators.getRole),
      catchAsync(RoleControllers.getRole),
    ])

    roleRoute.post('/', [
      UserMiddlewares.checkPermissions('roles', { write: true }),
      validate(roleValidators.createRole),
      RoleMiddlewares.checkRoleDoesNotExist,
      catchAsync(RoleControllers.createRole),
    ])

    roleRoute.post('/grantRole', [
      UserMiddlewares.checkPermissions('users', { update: true }),
      validate(roleValidators.grantRole),
      AdminMiddlewares.checkUserExist,
      RoleMiddlewares.checkRoleExist,
      catchAsync(RoleControllers.grantRole),
    ])

    roleRoute.delete('/revokeRole', [
      UserMiddlewares.checkPermissions('users', { update: true }),
      validate(roleValidators.revokeRole),
      AdminMiddlewares.checkUserExist,
      RoleMiddlewares.checkRoleExist,
      catchAsync(RoleControllers.revokeRole),
    ])

    return this.router.use(this.apiPath, roleRoute)
  }
}
