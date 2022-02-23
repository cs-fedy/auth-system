import { CommonRouteConfig } from '@common'
import { AuthMiddlewares, UserMiddlewares } from '@middlewares'
import AuthRoute from './auth.route'
import UserRoute from './user.route'

const routes: Array<CommonRouteConfig> = [
  new AuthRoute('/auth'),
  new UserRoute('/user', [
    AuthMiddlewares.auth(),
    UserMiddlewares.checkUserExist,
    UserMiddlewares.checkAccessAbility,
  ]),
]

export default routes
