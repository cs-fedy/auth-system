import { CommonRouteConfig } from '@common'
import { AuthMiddlewares, UserMiddlewares } from '@middlewares'
import AuthRoute from './auth.route'
import UserRoute from './user.route'
import AdminRoute from './admin.route'

const routes: Array<CommonRouteConfig> = [
  new AuthRoute('/auth'),
  new UserRoute('/user', [
    AuthMiddlewares.auth,
    UserMiddlewares.checkUserExist,
    UserMiddlewares.checkAccessAbility,
  ]),
  new AdminRoute('/admin', [
    AuthMiddlewares.auth,
    UserMiddlewares.checkUserExist,
    UserMiddlewares.checkAccessAbility,
    UserMiddlewares.checkAdmin,
  ]),
]

export default routes
