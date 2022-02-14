import { config } from '@configs'

export default {
  //* Get part after // and before : (in case port number in URL)
  //* E.g. <http://localhost:3000> becomes localhost
  domain: config.baseUrl?.split('//')[1].split(':')[0],
  httpOnly: true,
  path: '/',
  sameSite: true,
  //* Allow non-secure cookies only in development environment without HTTPS
  secure: !!config.baseUrl?.includes('https'),
}
