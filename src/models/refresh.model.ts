import mongoose from 'mongoose'
import { commonModelConfig } from '@common'

const requiredString = {
  type: String,
  required: true,
}

const requiredDate = {
  type: Date,
  required: true,
}

export interface Refresh extends commonModelConfig.IBSchema {
  token: string
  expiresIn: Date
  owner: mongoose.Types.ObjectId
}

export type PartialUser = Partial<Refresh>

const schema = new mongoose.Schema<Refresh>(
  {
    ...commonModelConfig.baseSchema.obj,
    token: requiredString,
    expiresIn: requiredDate,
    owner: {
      type: mongoose.Types.ObjectId,
      ref: 'users',
    },
  },
  commonModelConfig.schemaOptions
)

export default mongoose.model<Refresh>('refresh', schema)
