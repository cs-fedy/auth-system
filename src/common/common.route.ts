import express from 'express'

export default abstract class CommonRouteConfig {
  apiPath: string
  router: express.Router
  middlewares: any[]

  constructor(router: express.Router, apiPath: string, middlewares: any[] | undefined) {
    this.apiPath = apiPath
    this.router = router
    this.middlewares = middlewares || []
  }

  abstract getRoute(): express.Router
  abstract configureRoutes(): express.Router

  configureMiddlewares(router: express.Router, middlewares: any[]): express.Router {
    middlewares.forEach((middleware) => router.use(middleware))
    return router
  }
}
