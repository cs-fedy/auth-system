import express from 'express'

export default abstract class CommonRouteConfig {
  apiPath: string
  router: express.Router

  constructor(router: express.Router, apiPath: string) {
    this.apiPath = apiPath
    this.router = router
  }

  abstract getRoute(): express.Router
  abstract configureRoutes(): express.Router
}
