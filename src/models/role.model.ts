import mongoose from 'mongoose'
import { commonModelConfig } from '@common'
import { Resource } from './resource.model'

const requiredString = {
  type: String,
  required: true,
}

export interface Role extends commonModelConfig.IBSchema {
  name: string
  resources: Resource[]
}

const schema = new mongoose.Schema<Role>(
  {
    ...commonModelConfig.baseSchema.obj,
    name: requiredString,
    resources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'resources' }],
  },
  commonModelConfig.schemaOptions
)

export default mongoose.model<Role>('roles', schema)
