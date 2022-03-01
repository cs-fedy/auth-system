import { DAOUser, userModel } from '@models'
import { sendEmail } from '@jobs'
import { hash } from '@root/utils'
import { config } from '@configs'
export default class AdminServices {
  static async createUser(data: any, roleName: string): Promise<userModel.User> {
    const newData = { ...data, password: await hash.hash(data.password) }
    const user = await DAOUser.createUser(newData)

    sendEmail({
      to: user?.email,
      from: config.emailSender,
      subject: 'user created',
      text: `${user?.firstName} ${user?.lastName} your are now a user of the platform as a ${roleName}`,
    })

    return user as userModel.User
  }
}
