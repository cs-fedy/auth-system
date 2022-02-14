import express from 'express'
import { CommonRouteConfig } from '@common'
import { validate, AuthMiddlewares } from '@middlewares'
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
      AuthMiddlewares.checkUserDoesNotExist,
      catchAsync(AuthControllers.createAccount),
    ])

    authRouter.post('/login', [
      AuthMiddlewares.rateLimiter,
      validate(authValidators.login),
      AuthMiddlewares.checkUserExistByEmail,
      AuthMiddlewares.checkPasswordIsValid,
      catchAsync(AuthControllers.login),
    ])

    authRouter.post('/logout', [
      AuthMiddlewares.auth(),
      AuthMiddlewares.checkUserExist,
      catchAsync(AuthControllers.logout),
    ])

    authRouter.post('/refresh_token', [
      AuthMiddlewares.checkRefreshToken,
      AuthMiddlewares.checkUserExist,
      catchAsync(AuthControllers.refreshToken),
    ])

    authRouter.post('/verify_email', [
      AuthMiddlewares.auth(),
      AuthMiddlewares.checkUserExist,
      catchAsync(AuthControllers.verifyEmail),
    ])

    authRouter.post('/confirm_email', [
      AuthMiddlewares.auth(),
      validate(authValidators.confirmEmail),
      AuthMiddlewares.checkUserExist,
      AuthMiddlewares.checkConfirmCode,
      catchAsync(AuthControllers.confirmEmail),
    ])

    authRouter.post('/forget_password', [
      // validate user input
      // verify user existence by email
      // send verification code
    ])

    authRouter.post('/reset_password', [
      // validate user input
      // verify user existence by email
      // validate the reset code
      // invalidate all access and refresh tokens
      // reset password
    ])

    return this.router.use(this.apiPath, authRouter)
  }
}
