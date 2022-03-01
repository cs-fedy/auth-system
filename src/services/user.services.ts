import { userModel, DAOUser, DAORole } from '@models'
import { AuthTypes } from '@custom-types'
import { hash } from '@utils'
import { sendEmail } from '@jobs'
import { config } from '@configs'

export default class UserServices {
  static async getUserByEmail(email: string): Promise<userModel.User | null> {
    return await DAOUser.getUserByEmail(email)
  }

  static async getUserById(userId: string): Promise<userModel.User | null> {
    return await DAOUser.getUserById(userId)
  }

  static async createAccount(user: userModel.User): Promise<AuthTypes.CreateAccountPayload> {
    const studentRole = await DAORole.getRole({ name: 'student' }) //* get student role
    const allRole = await DAORole.getRole({ name: 'all' }) //* get student role
    const { id: userId } = await DAOUser.createUser({
      ...user,
      password: await hash.hash(user.password),
      roles: [studentRole?.id || '', allRole?.id || ''],
    })

    return { userId }
  }

  static async updateFirstName(userId: string, newFirstName: string): Promise<userModel.User> {
    const user = await DAOUser.updateUserById(userId, { firstName: newFirstName })
    return user as userModel.User
  }

  static async updateLastName(userId: string, newLastName: string): Promise<userModel.User> {
    const user = await DAOUser.updateUserById(userId, { firstName: newLastName })
    return user as userModel.User
  }

  static async updatePassword(userId: string, newPassword: string): Promise<userModel.User> {
    const user = await DAOUser.updateUserById(userId, { password: await hash.hash(newPassword) })
    sendEmail({
      to: user?.email,
      from: config.emailSender,
      subject: 'password changed',
      text: `${user?.firstName} ${user?.lastName} your password is changed, you are being logged from all the devices`,
    })

    return user as userModel.User
  }

  static async updateEmail(
    userId: string,
    oldEmail: string,
    newEmail: string
  ): Promise<userModel.User> {
    const user = await DAOUser.updateUserById(userId, { email: newEmail })
    sendEmail({
      to: newEmail,
      from: config.emailSender,
      subject: 'email changed',
      text: `${user?.firstName} ${user?.lastName} your changed your email to ${newEmail}, you are being logged out from all the devices`,
    })

    sendEmail({
      to: oldEmail,
      from: config.emailSender,
      subject: 'email changed',
      text: `${user?.firstName} ${user?.lastName} your email is being changed to ${newEmail}, you are being logged out from all the devices`,
    })

    return user as userModel.User
  }
}
