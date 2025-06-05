import request from 'supertest'

// Mock middlewares to bypass database and redis interactions
jest.mock('../src/middlewares/auth.middlewares', () => ({
  __esModule: true,
  default: {
    rateLimiter: (_req: any, _res: any, next: any) => next(),
    checkPasswordIsValid: (_req: any, _res: any, next: any) => next(),
    auth: (_req: any, _res: any, next: any) => next(),
    checkRefreshToken: (_req: any, _res: any, next: any) => next(),
    checkCode: (_req: any, _res: any, next: any) => next(),
  },
}))

jest.mock('../src/middlewares/user.middlewares', () => ({
  __esModule: true,
  default: {
    checkUserExistByEmail: (req: any, _res: any, next: any) => {
      req.body.user = { id: '1', password: 'hashed', roles: [] }
      next()
    },
    checkUserDoesNotExist: (_req: any, _res: any, next: any) => next(),
    checkUserExist: (_req: any, _res: any, next: any) => next(),
    checkUserPassword: (_req: any, _res: any, next: any) => next(),
    checkRole: () => (_req: any, _res: any, next: any) => next(),
    checkPermissions: () => (_req: any, _res: any, next: any) => next(),
  },
}))

const generateTokens = jest.fn().mockResolvedValue({
  access: { token: 'access' },
  refresh: { token: 'refresh', expiresIn: new Date() },
})
const createRefreshToken = jest.fn().mockResolvedValue(null)

jest.mock('../src/services', () => ({
  __esModule: true,
  AuthServices: {
    generateTokens,
    createRefreshToken,
  },
  UserServices: {},
}))

import app from '../src/app'

describe('POST /api/v1/auth/login', () => {
  it('should return 200 on valid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@platform.com', password: 'platform_password2022' })
    expect(res.status).toBe(200)
    expect(generateTokens).toHaveBeenCalled()
  })
})
