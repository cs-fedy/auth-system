import { userModel, DAOUser, DAORole } from '@models'
import { AuthTypes } from '@custom-types'
import { hash } from '@utils'
import { sendEmail } from '@jobs'

export default class UserServices {
  static async getUserByEmail(email: string): Promise<userModel.User | null> {
    return await DAOUser.getUserByEmail(email)
  }

  static async getUserById(userId: string): Promise<userModel.User | null> {
    return await DAOUser.getUserById(userId)
  }

  static async createAccount(user: userModel.User): Promise<AuthTypes.CreateAccountPayload> {
    const role = await DAORole.getRole({ name: 'student' }) // get student role
    const { id: userId } = await DAOUser.createUser({
      ...user,
      password: await hash.hash(user.password),
      roles: [role?.id || ''],
    })

    return { userId }
  }

  static async updateFirstName(
    userId: string,
    newFirstName: string
  ): Promise<userModel.User | null> {
    return await DAOUser.updateUserById(userId, { firstName: newFirstName })
  }

  static async updateLastName(userId: string, newLastName: string): Promise<userModel.User | null> {
    return await DAOUser.updateUserById(userId, { lastName: newLastName })
  }

  static async deactivateUser(userId: string): Promise<userModel.User | null> {
    const user = await DAOUser.updateUserById(userId, { activated: false })
    sendEmail({
      to: user?.email,
      from: 'fedi.abd01@gmail.com',
      subject: 'account deactivated',
      text: `${user?.firstName} ${user?.lastName} your account is deactivated`,
    })

    return user
  }

  static async activateUser(userId: string): Promise<userModel.User | null> {
    const user = await DAOUser.updateUserById(userId, { activated: true })
    sendEmail({
      to: user?.email,
      from: 'fedi.abd01@gmail.com',
      subject: 'account activated',
      text: `${user?.firstName} ${user?.lastName} your account is activated`,
    })

    return user
  }

  static async deleteAccount(userId: string): Promise<userModel.User | null> {
    const user = await DAOUser.updateUserById(userId, { isDeleted: true })
    sendEmail({
      to: user?.email,
      from: 'fedi.abd01@gmail.com',
      subject: 'account deleted',
      text: `${user?.firstName} ${user?.lastName} your account is deleted`,
    })

    return user
  }

  static async updatePassword(userId: string, newPassword: string): Promise<userModel.User | null> {
    const user = await DAOUser.updateUserById(userId, { password: await hash.hash(newPassword) })
    sendEmail({
      to: user?.email,
      from: 'fedi.abd01@gmail.com',
      subject: 'password changed',
      text: `${user?.firstName} ${user?.lastName} your password is changed, you are being logged from all the devices`,
    })

    return user
  }

  static async updateEmail(
    userId: string,
    oldEmail: string,
    newEmail: string
  ): Promise<userModel.User | null> {
    const user = await DAOUser.updateUserById(userId, { email: newEmail })
    sendEmail({
      to: newEmail,
      from: 'fedi.abd01@gmail.com',
      subject: 'email changed',
      text: `${user?.firstName} ${user?.lastName} your changed your email to ${newEmail}, you are being logged from all the devices`,
    })

    sendEmail({
      to: oldEmail,
      from: 'fedi.abd01@gmail.com',
      subject: 'email changed',
      text: `${user?.firstName} ${user?.lastName} your email is being changed to ${newEmail}, you are being logged from all the devices`,
    })

    return user
  }
}
