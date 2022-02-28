import { roleModel } from '@models'

export default class DAORole {
  static async getRoleById(roleId: string): Promise<roleModel.Role | null> {
    return await roleModel.default.findById(roleId)
  }

  static async getRole(query: any): Promise<roleModel.Role | null> {
    return await roleModel.default.findOne(query)
  }

  static async getRoles(): Promise<roleModel.Role[]> {
    return await roleModel.default.find()
  }

  static async createRole(data: any): Promise<roleModel.Role | null> {
    return await roleModel.default.create(data)
  }

  static async updateRoleById(roleId: string, data: any): Promise<roleModel.Role | null> {
    return await roleModel.default.findByIdAndUpdate(roleId, data)
  }
}
