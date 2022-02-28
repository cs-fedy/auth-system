import { resourceModel } from '@models'

export default class DAOResource {
  static async getResource(query: any): Promise<resourceModel.Resource | null> {
    return await resourceModel.default.findOne(query)
  }

  static async getResourceById(resourceId: string): Promise<resourceModel.Resource | null> {
    return await resourceModel.default.findById(resourceId)
  }

  static async getResources(): Promise<resourceModel.Resource[]> {
    return resourceModel.default.find()
  }

  static async createResource(data: any): Promise<resourceModel.Resource | null> {
    return await resourceModel.default.create(data)
  }
}
