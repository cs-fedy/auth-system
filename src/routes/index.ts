import { CommonRouteConfig } from '@common'
import { AuthMiddlewares, UserMiddlewares } from '@middlewares'
import AuthRoute from './auth.route'
import UserRoute from './user.route'
import AdminRoute from './admin.route'

// TODO: test routes for all scenarios
// TODO: add testing to the app
// TODO: only allow verified users to access some routes
const routes: Array<CommonRouteConfig> = [
  new AuthRoute('/auth'),
  new UserRoute('/user', [
    AuthMiddlewares.auth,
    UserMiddlewares.checkUserExist,
    UserMiddlewares.checkRole('all'),
  ]),
  new AdminRoute('/admin', [
    AuthMiddlewares.auth,
    UserMiddlewares.checkUserExist,
    UserMiddlewares.checkRole('admin'),
  ]),
]

export default routes
