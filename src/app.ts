import express from 'express'
import helmet from 'helmet'
import compression from 'compression'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { CommonRouteConfig } from '@common'
import { errorHandler } from '@middlewares'
import { HttpStatus, HttpMessages } from '@custom-types'
import { ApiError } from '@utils'
import { Morgan, config } from '@configs'
import routes from '@routes'

class App {
  private _app: express.Application
  private _apiPath: string

  constructor(
    apiPath: string,
    routes: Array<CommonRouteConfig>,
    middlewares: Array<any>,
    errorHandler: any
  ) {
    this._app = express()
    this._apiPath = apiPath

    this.configMiddlewares(middlewares)
    this.configureRoutes(routes)

    // send back a 404 error for any unknown api request
    this._app.use((req, res, next) => {
      next(new ApiError(HttpStatus.NOT_FOUND, HttpMessages.H404))
    })

    // handle error
    this._app.use(errorHandler)
  }

  private configMiddlewares(middlewares: Array<any>) {
    middlewares.forEach((middleware) => this._app.use(middleware))
  }

  private configureRoutes(routes: Array<CommonRouteConfig>) {
    routes.forEach((route) => this._app.use(this._apiPath, route.getRoute()))
  }

  getApp(): express.Application {
    return this._app
  }
}

const middlewares: Array<any> = []
if (config.env !== 'test') {
  middlewares.push(Morgan.successHandler)
  middlewares.push(Morgan.errorHandler)
}

// parse cookies
middlewares.push(cookieParser())

// set security HTTP headers
middlewares.push(helmet())

// parse json request body
middlewares.push(express.json())

// parse urlencoded request body
middlewares.push(express.urlencoded({ extended: true }))

// gzip compression
middlewares.push(compression())

// enable cors
middlewares.push(cors())

const expressApp = new App('/api/v1', routes, middlewares, errorHandler)
export default expressApp.getApp()
