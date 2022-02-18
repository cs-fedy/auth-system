import express from 'express'
import { CommonRouteConfig } from '@common'
import { validate, AuthMiddlewares, UserMiddlewares } from '@middlewares'
import { authValidators } from '@validators'
import { AuthControllers } from '@controllers'
import { catchAsync } from '@utils'

export default class AuthRoute extends CommonRouteConfig {
  constructor(apiPath: string) {
    super(express.Router(), apiPath)
    this.router = this.configureRoutes()
  }

  getRoute(): express.Router {
    return this.router
  }

  configureRoutes(): express.Router {
    const authRouter = express.Router()

    authRouter.post('/create_account', [
      validate(authValidators.createAccount),
      UserMiddlewares.checkUserDoesNotExist,
      catchAsync(AuthControllers.createAccount),
    ])

    authRouter.post('/login', [
      // TODO: fix rate limiter middleware
      // AuthMiddlewares.rateLimiter,
      validate(authValidators.login),
      UserMiddlewares.checkUserExistByEmail,
      AuthMiddlewares.checkPasswordIsValid,
      catchAsync(AuthControllers.login),
    ])

    authRouter.post('/logout', [
      AuthMiddlewares.auth(),
      UserMiddlewares.checkUserExist,
      catchAsync(AuthControllers.logout),
    ])

    authRouter.post('/refresh_token', [
      AuthMiddlewares.checkRefreshToken,
      UserMiddlewares.checkUserExist,
      catchAsync(AuthControllers.refreshToken),
    ])

    authRouter.post('/verify_email', [
      AuthMiddlewares.auth(),
      UserMiddlewares.checkUserExist,
      catchAsync(AuthControllers.verifyEmail),
    ])

    authRouter.post('/confirm_email', [
      AuthMiddlewares.auth(),
      validate(authValidators.confirmEmail),
      UserMiddlewares.checkUserExist,
      AuthMiddlewares.checkCode,
      catchAsync(AuthControllers.confirmEmail),
    ])

    authRouter.post('/forget_password', [
      validate(authValidators.forgetPassword),
      UserMiddlewares.checkUserExistByEmail,
      catchAsync(AuthControllers.forgetPassword),
    ])

    // TODO: fix this route
    authRouter.post('/reset_password', [
      validate(authValidators.resetPassword),
      UserMiddlewares.checkUserExistByEmail,
      AuthMiddlewares.checkCode,
      catchAsync(AuthControllers.resetPassword),
    ])

    return this.router.use(this.apiPath, authRouter)
  }
}
