import { DAOUser, refreshModel, DAORefresh, DAORole } from '@models'
import { AuthTypes, errorTypes } from '@custom-types'
import { hash, token } from '@utils'
import { redis } from '@db'
import { tokens } from '@configs'
import { destroyAccount, sendEmail } from '@root/jobs'

export default class AuthServices {
  static async generateTokens(userId: string, rolesIds: string[]): Promise<AuthTypes.AuthPayload> {
    const roles: string[] = []
    for (const roleId of rolesIds) {
      const role = await DAORole.getRoleById(roleId)
      roles.push(role?.name || '')
    }

    const data = { userId, roles }
    return {
      access: token.generateAccessToken(data),
      refresh: await token.generateRefreshToken(),
    }
  }

  static async createRefreshToken(
    refreshToken: AuthTypes.RefreshToken,
    owner: string
  ): Promise<refreshModel.Refresh> {
    return await DAORefresh.createRefresh(refreshToken, owner)
  }

  static async deleteRefreshToken(refreshToken: string): Promise<refreshModel.Refresh | null> {
    return await DAORefresh.deleteToken(refreshToken)
  }

  static async blackListAccessToken(token: { accessToken: string; userId: string; exp: number }) {
    const key = `${tokens.ACCESS}_${token.userId}`
    try {
      let res: { [index: string]: number }
      const result = await redis.get(key)
      if (result) {
        res = JSON.parse(result)
        res[token.accessToken] = token.exp
        res['all_invalidated'] = 0
      } else {
        res = { [token.accessToken]: token.exp }
      }

      await redis.set(key, JSON.stringify(res))
    } catch (error) {
      throw new errorTypes.InternalServerError()
    }
  }

  static async getRefreshToken(token: string): Promise<refreshModel.Refresh | null> {
    return await DAORefresh.getRefreshToken(token)
  }

  static async updateRefreshToken(
    oldToken: string,
    newToken: AuthTypes.RefreshToken
  ): Promise<refreshModel.Refresh | null> {
    return await DAORefresh.updateRefreshToken(oldToken, newToken)
  }

  static async verifyEmail(email: string): Promise<AuthTypes.VerifyEmailPayload> {
    const { code, expiresIn } = token.generateCode()
    try {
      sendEmail({
        to: email,
        from: 'fedi.abd01@gmail.com',
        subject: 'Confirmation email',
        text: `this is your confirmation code: ${code} - if you don't verify your account in a day, it will be destroyed automatically`,
      })

      destroyAccount(email)
      await redis.setex(`${tokens.VERIFY_EMAIL}_${email}`, Math.round(expiresIn / 1000), code)
    } catch (error) {
      throw new errorTypes.InternalServerError()
    }

    return { expiresIn: new Date(expiresIn) }
  }

  static async confirmEmail(email: string): Promise<{ [userId: string]: string }> {
    const user = await DAOUser.updateUser({ email }, { verified: true })
    return { userId: user?.id || '' }
  }

  static async forgetPassword(email: string): Promise<AuthTypes.ForgetPasswordPayload> {
    const { code, expiresIn } = token.generateCode()
    try {
      sendEmail({
        to: email,
        from: 'fedi.abd01@gmail.com',
        subject: 'password reset code',
        text: `this is your password reset code: ${code}`,
      })

      await redis.setex(`${tokens.VERIFY_EMAIL}_${email}`, Math.round(expiresIn / 1000), code)
    } catch (error) {
      console.log(error)
      throw new errorTypes.InternalServerError()
    }

    return { expiresIn: new Date(expiresIn) }
  }

  static async resetPassword(email: string, newPassword: string): Promise<void> {
    const hashedPassword = await hash.hash(newPassword)
    await DAOUser.updateUser({ email }, { password: hashedPassword })
  }

  static async clearRefreshTokens(id: string): Promise<void> {
    await DAORefresh.clearTokens({ owner: id })
  }

  static async invalidateAccessTokens(email: string) {
    try {
      let res: { [x: string]: number } = {}
      const result = await redis.get(`${tokens.ACCESS}_${email}`)
      if (result) {
        res = JSON.parse(result)
      }
      res['all_invalidated'] = 1
      await redis.set(`${tokens.ACCESS}_${email}`, JSON.stringify(res))
    } catch (error) {
      throw new errorTypes.InternalServerError()
    }
  }
}
