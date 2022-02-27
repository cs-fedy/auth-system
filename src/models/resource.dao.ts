import { resourceModel } from '@models'

export default class DAOResource {
  static async getResource(query: any): Promise<resourceModel.Resource | null> {
    return await resourceModel.default.findOne(query)
  }

  static async createResource(data: any): Promise<resourceModel.Resource | null> {
    return await resourceModel.default.create(data)
  }
}
