import sgMail from '@sendgrid/mail'
import { DAOUser, refreshModel, DAORefresh } from '@models'
import { AuthTypes, errorTypes } from '@custom-types'
import { hash, token } from '@utils'
import { redis } from '@db'
import { config, tokens } from '@configs'

export default class AuthServices {
  static async generateTokens(userId: string): Promise<AuthTypes.AuthPayload> {
    return {
      access: token.generateAccessToken({ userId }),
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
    sgMail.setApiKey(config.sendGridApiKey)
    try {
      const msg = {
        to: email,
        from: 'fedi.abd01@gmail.com',
        subject: 'Confirmation email',
        text: `this is your confirmation code: ${code}`,
      }
      await sgMail.send(msg)

      await redis.setex(`${tokens.VERIFY_EMAIL}_${email}`, Math.round(expiresIn / 1000), code)
    } catch (error) {
      throw new errorTypes.InternalServerError()
    }

    return { expiresIn }
  }

  static async confirmEmail(email: string): Promise<{ [userId: string]: string }> {
    const user = await DAOUser.updateUser({ email }, { verified: true })
    return { userId: user?.id || '' }
  }

  static async forgetPassword(email: string): Promise<AuthTypes.ForgetPasswordPayload> {
    const { code, expiresIn } = token.generateCode()
    sgMail.setApiKey(config.sendGridApiKey)
    try {
      const msg = {
        to: email,
        from: 'fedi.abd01@gmail.com',
        subject: 'password reset code',
        text: `this is your password reset code: ${code}`,
      }
      sgMail.send(msg)

      await redis.setex(`${tokens.VERIFY_EMAIL}_${email}`, Math.round(expiresIn / 1000), code)
    } catch (error) {
      console.log(error)
      throw new errorTypes.InternalServerError()
    }

    return { expiresIn }
  }

  static async resetPassword(email: string, newPassword: string): Promise<string> {
    const hashedPassword = await hash.hash(newPassword)
    const user = await DAOUser.updateUser({ email }, { password: hashedPassword })
    return user?.id || ''
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
