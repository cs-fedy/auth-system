import { userModel, DAOUser } from '@models'
import { AuthTypes } from '@custom-types'
import { hash } from '@utils'

export default class UserServices {
  static async getUserByEmail(email: string): Promise<userModel.User | null> {
    return await DAOUser.getUserByEmail(email)
  }

  static async getUserById(userId: string): Promise<userModel.User | null> {
    return await DAOUser.getUserById(userId)
  }

  static async createAccount(
    user: userModel.User
  ): Promise<AuthTypes.CreateAccountPayload> {
    const { id: userId } = await DAOUser.createUser({
      ...user,
      password: await hash.hash(user.password),
    })
    return { userId }
  }
}
