import mongoose from 'mongoose'
import { commonModelConfig } from '@common'
import { Role } from './role.model'

const requiredString = {
  type: String,
  required: true,
}

export interface User extends commonModelConfig.IBSchema {
  email: string
  password: string
  firstName: string
  lastName: string
  verified: boolean
  activated: boolean
  roles: Role[] | string[]
}

export type PartialUser = Partial<User>

const schema = new mongoose.Schema<User>(
  {
    ...commonModelConfig.baseSchema.obj,
    email: requiredString,
    password: requiredString,
    firstName: requiredString,
    lastName: requiredString,
    verified: {
      type: Boolean,
      default: false,
    },
    activated: {
      type: Boolean,
      default: true,
    },
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'roles' }],
  },
  commonModelConfig.schemaOptions
)

export default mongoose.model<User>('users', schema)
