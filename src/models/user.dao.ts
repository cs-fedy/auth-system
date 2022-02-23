import { userModel } from '@models'

export default class DAOUser {
  static async getUserByEmail(email: string): Promise<userModel.User | null> {
    return await userModel.default.findOne({ email })
  }

  static async getUserById(userId: string): Promise<userModel.User | null> {
    return await userModel.default.findById(userId)
  }

  static async createUser(user: userModel.User): Promise<userModel.User> {
    return await userModel.default.create(user)
  }

  static async updateUser(query: any, update: any): Promise<userModel.User | null> {
    return await userModel.default.findOneAndUpdate(query, update)
  }

  static async updateUserById(userId: string, update: any): Promise<userModel.User | null> {
    return await userModel.default.findByIdAndUpdate(userId, update)
  }

  static async deleteUser(email: string): Promise<string | null> {
    return await userModel.default.findOneAndRemove({ email })
  }
}
