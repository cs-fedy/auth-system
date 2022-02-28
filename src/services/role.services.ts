import { roleModel, DAORole, userModel, DAOUser, resourceModel } from '@models'
import { sendEmail } from '@jobs'
import { ResourceServices } from '@services'

export default class RoleServices {
  static async createRole(name: string): Promise<roleModel.Role> {
    const role = await DAORole.createRole({ name })
    return role as roleModel.Role
  }

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

  static async getRoles(rolesIds: string[]): Promise<roleModel.Role[]> {
    const roles: roleModel.Role[] = []
    for (const roleId of rolesIds) {
      roles.push(await this.getRole(roleId))
    }
    return roles
  }

  static async listRoles(): Promise<roleModel.Role[]> {
    const roles: roleModel.Role[] = []
    for (let role of await DAORole.getRoles()) {
      const resources: resourceModel.Resource[] = []
      for (const resourceId of role.resources) {
        const resource = await ResourceServices.getResource(resourceId as string)
        resources.push(resource as resourceModel.Resource)
      }
      role = { ...role, resources }
      roles.push(role)
    }

    return roles
  }

  static async getRole(roleId: string): Promise<roleModel.Role> {
    const role = (await DAORole.getRoleById(roleId)) as roleModel.Role
    const resources: resourceModel.Resource[] = []
    for (const resourceId of role.resources) {
      const resource = await ResourceServices.getResource(resourceId as string)
      resources.push(resource as resourceModel.Resource)
    }

    return { ...role, resources }
  }
}
