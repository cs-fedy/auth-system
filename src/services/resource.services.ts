import { resourceModel, DAOResource, DAORole, roleModel } from '@models'

export default class ResourceServices {
  static async createResource(data: any): Promise<resourceModel.Resource> {
    const resource = await DAOResource.createResource(data)
    return resource as resourceModel.Resource
  }

  static async assignResource(roleId: string, resourceId: string): Promise<roleModel.Role> {
    const role = await DAORole.updateRoleById(roleId, { $push: { resources: resourceId } })
    return role as roleModel.Role
  }

  static async listResources(): Promise<resourceModel.Resource[]> {
    return await DAOResource.getResources()
  }

  static async getResource(resourceId: string): Promise<resourceModel.Resource> {
    return (await DAOResource.getResourceById(resourceId)) as resourceModel.Resource
  }
}
