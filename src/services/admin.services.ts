import { DAOUser, userModel } from '@models'
import { sendEmail } from '@jobs'
import { hash } from '@root/utils'
export default class AdminServices {
  static async grantRole(
    userId: string,
    roleId: string,
    roleName: string
  ): Promise<userModel.User | null> {
    const user = await DAOUser.updateUserById(userId, { $push: { roles: roleId } })

    sendEmail({
      to: user?.email,
      from: 'fedi.abd01@gmail.com',
      subject: 'role granted',
      text: `${user?.firstName} ${user?.lastName} your are granted the ${roleName} role`,
    })

    return user
  }

  static async revokeRole(
    userId: string,
    roleId: string,
    roleName: string
  ): Promise<userModel.User | null> {
    const user = await DAOUser.updateUserById(userId, { $pull: { roles: roleId } })

    sendEmail({
      to: user?.email,
      from: 'fedi.abd01@gmail.com',
      subject: 'role revoked',
      text: `${user?.firstName} ${user?.lastName} your are no longer an ${roleName}`,
    })

    return user
  }

  static async createUser(data: any, roleName: string): Promise<userModel.User> {
    const newData = { ...data, password: await hash.hash(data.password) }
    const user = await DAOUser.createUser(newData)

    sendEmail({
      to: user?.email,
      from: 'fedi.abd01@gmail.com',
      subject: 'user created',
      text: `${user?.firstName} ${user?.lastName} your are now a user of the platform as a ${roleName}`,
    })

    return user as userModel.User
  }
}
