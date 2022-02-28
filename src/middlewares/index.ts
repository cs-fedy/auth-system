import AuthMiddlewares from './auth.middlewares'
import UserMiddlewares from './user.middlewares'
import AdminMiddlewares from './admin.middlewares'
import RoleMiddlewares from './role.middlewares'
import ResourceMiddlewares from './resource.middlewares'
import errorHandler from './error'
import validate from './validate'

export {
  AuthMiddlewares,
  UserMiddlewares,
  AdminMiddlewares,
  RoleMiddlewares,
  ResourceMiddlewares,
  errorHandler,
  validate,
}
