import express from 'express'
import { CommonRouteConfig } from '@common'

export default class DocsRoute extends CommonRouteConfig {
  constructor(apiPath: string) {
    super(express.Router(), apiPath)
    this.router = this.configureRoutes()
  }

  getRoute(): express.Router {
    return this.router
  }

  configureRoutes(): express.Router {
    const docsRouter = express.Router()

    return this.router.use(this.apiPath, docsRouter)
  }
}
