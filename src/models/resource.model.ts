import mongoose from 'mongoose'
import { commonModelConfig } from '@common'
import { JsonWebTokenError } from 'jsonwebtoken'

const requiredString = {
  type: String,
  required: true,
}

const requiredBoolean = {
  type: Boolean,
  required: true,
}

interface Permission {
  read: boolean
  write: boolean
  update: boolean
  delete: boolean
}

export interface Resource extends commonModelConfig.IBSchema {
  name: string
  permissions: Permission[]
}

const schema = new mongoose.Schema<Resource>(
  {
    ...commonModelConfig.baseSchema.obj,
    name: requiredString,
    permissions: {
      read: requiredBoolean,
      write: requiredBoolean,
      update: requiredBoolean,
      delete: requiredBoolean,
    },
  },
  commonModelConfig.schemaOptions
)

export default mongoose.model<Resource>('resources', schema)
