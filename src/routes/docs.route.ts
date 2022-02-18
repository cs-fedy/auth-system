import express from 'express'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUI from 'swagger-ui-express'
import { CommonRouteConfig } from '@common'
import { swaggerDefinition } from '@docs'

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
    const specs = swaggerJsdoc({
      swaggerDefinition,
      apis: ['src/docs/*yml'],
    })

    docsRouter.use('/', swaggerUI.serve)
    docsRouter.get(
      '/',
      swaggerUI.setup(specs, {
        explorer: true,
      })
    )

    return this.router.use(this.apiPath, docsRouter)
  }
}
