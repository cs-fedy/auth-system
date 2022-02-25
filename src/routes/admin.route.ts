import express from 'express'
import { CommonRouteConfig } from '@common'

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

    return this.router.use(this.apiPath, adminRoute)
  }
}
