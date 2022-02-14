import mongoose from 'mongoose'
import { commonModelConfig } from '@common'

const requiredString = {
  type: String,
  required: true,
}

export interface User extends commonModelConfig.IBSchema {
  email: string
  password: string
  fullName: string
  verified: boolean
  activated: boolean
}

export type PartialUser = Partial<User>

const schema = new mongoose.Schema<User>(
  {
    ...commonModelConfig.baseSchema.obj,
    email: requiredString,
    password: requiredString,
    fullName: requiredString,
    verified: {
      type: Boolean,
      default: false,
    },
    activated: {
      type: Boolean,
      default: true,
    },
  },
  commonModelConfig.schemaOptions
)

export default mongoose.model<User>('users', schema)
