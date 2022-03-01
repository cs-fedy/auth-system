import { AuthTypes } from '@custom-types'
import { refreshModel } from '@models'

export default class DAORefresh {
  static async getRefreshToken(token: string): Promise<refreshModel.Refresh | null> {
    return await refreshModel.default.findOne({ token })
  }

  static async createRefresh(
    token: AuthTypes.RefreshToken,
    owner: string
  ): Promise<refreshModel.Refresh> {
    return await refreshModel.default.create({ ...token, owner })
  }

  static async deleteToken(token: string): Promise<refreshModel.Refresh | null> {
    return await refreshModel.default.findOneAndDelete({ token })
  }

  static async updateRefreshToken(
    oldToken: string,
    newToken: AuthTypes.RefreshToken
  ): Promise<refreshModel.Refresh | null> {
    return await refreshModel.default.findOneAndUpdate({ token: oldToken }, newToken)
  }

  static async clearTokens(query: any): Promise<void> {
    await refreshModel.default.deleteMany(query)
  }
}
