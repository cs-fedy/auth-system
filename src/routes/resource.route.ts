import express from 'express'
import { CommonRouteConfig } from '@common'
import { validate, ResourceMiddlewares, RoleMiddlewares, UserMiddlewares } from '@middlewares'
import { resourceValidators } from '@validators'
import { catchAsync } from '@utils'
import { ResourceControllers } from '@controllers'

export default class ResourceRoute extends CommonRouteConfig {
  constructor(apiPath: string, middlewares: any[] | undefined = undefined) {
    super(express.Router(), apiPath, middlewares)
    this.router = this.configureRoutes()
  }

  getRoute(): express.Router {
    return this.router
  }

  configureRoutes(): express.Router {
    const resourceRoute = this.configureMiddlewares(express.Router(), this.middlewares)

    resourceRoute.get('/', [
      UserMiddlewares.checkPermissions('resources', { read: true }),
      catchAsync(ResourceControllers.listResources),
    ])

    resourceRoute.get('/:resourceId', [
      UserMiddlewares.checkPermissions('resources', { read: true }),
      validate(resourceValidators.getResource),
      catchAsync(ResourceControllers.getResource),
    ])

    resourceRoute.post('/', [
      UserMiddlewares.checkPermissions('resources', { write: true }),
      validate(resourceValidators.createResource),
      ResourceMiddlewares.checkResourceDoesNotExist,
      catchAsync(ResourceControllers.createResource),
    ])

    resourceRoute.post('/assignResource', [
      UserMiddlewares.checkPermissions('roles', { update: true }),
      validate(resourceValidators.assignResource),
      RoleMiddlewares.checkRoleExist,
      ResourceMiddlewares.checkResourceExist,
      catchAsync(ResourceControllers.assignResource),
    ])

    return this.router.use(this.apiPath, resourceRoute)
  }
}
