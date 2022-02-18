import { CommonRouteConfig } from '@common'
import AuthRoute from './auth.route'
import DocsRoute from './docs.route'

const routes: Array<CommonRouteConfig> = [
  new DocsRoute('/docs'),
  new AuthRoute('/auth'),
]

export default routes
