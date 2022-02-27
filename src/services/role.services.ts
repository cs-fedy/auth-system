import { roleModel, DAORole, resourceModel, DAOResource } from '@models'

export default class RoleServices {
  static async createRole(name: string): Promise<roleModel.Role> {
    const role = await DAORole.createRole({ name })
    return role as roleModel.Role
  }

  static async createResource(data: any): Promise<resourceModel.Resource> {
    const resource = await DAOResource.createResource(data)
    return resource as resourceModel.Resource
  }

  static async assignResource(roleId: string, resourceId: string): Promise<roleModel.Role> {
    const role = await DAORole.updateRoleById(roleId, { $push: { resources: resourceId } })
    return role as roleModel.Role
  }
}
