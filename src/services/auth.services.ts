import sgMail from '@sendgrid/mail'
import { userModel, DAOUser, refreshModel, DAORefresh } from '@models'
import { AuthTypes } from '@custom-types'
import { hash, token } from '@utils'
import { redis } from '@db'
import { config, tokens } from '@configs'

export default class AuthServices {
  static async getUserByEmail(email: string): Promise<userModel.User | null> {
    return await DAOUser.getUserByEmail(email)
  }

  static async getUserById(userId: string): Promise<userModel.User | null> {
    return await DAOUser.getUserById(userId)
  }

  static async createAccount(user: userModel.User): Promise<AuthTypes.CreateAccountPayload> {
    const { id: userId } = await DAOUser.createUser({
      ...user,
      password: await hash.hash(user.password),
    })
    return { userId }
  }

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

  static async deleteRefreshToken(
    refreshToken: string
  ): Promise<refreshModel.Refresh | null> {
    return await DAORefresh.deleteToken(refreshToken)
  }

  static blackListAccessToken(token: {
    accessToken: string
    userId: string
    exp: number
  }) {
    const key = `${tokens.REFRESH}_${token.userId}`
    redis.get(key, async (err, result) => {
      let res: { [index: string]: number }
      if (result) {
        res = JSON.parse(result)
        res[token.accessToken] = token.exp
      } else {
        res = { [token.accessToken]: token.exp }
      }

      await redis.set(key, JSON.stringify(res))
    })
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
    const msg = {
      to: email,
      from: 'fedi.abd01@gmail.com',
      subject: 'Confirmation email',
      text: `this is your confirmation code: ${code}`,
    }
    sgMail.send(msg)

    await redis.setex(
      `${tokens.VERIFY_EMAIL}_${email}`,
      new Date(expiresIn).getDate(),
      code
    )

    return { expiresIn }
  }

  static async confirmEmail(
    email: string
  ): Promise<{ [userId: string]: string }> {
    const user = await DAOUser.updateUser({ email }, { activated: true })
    return { userId: user?.id || '' }
  }
}
