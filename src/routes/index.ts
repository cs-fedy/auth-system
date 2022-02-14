import { CommonRouteConfig } from '@common'
import AuthRoute from './auth.route'

const routes: Array<CommonRouteConfig> = [new AuthRoute('/auth')]

export default routes
