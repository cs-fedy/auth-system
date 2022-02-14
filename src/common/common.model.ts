import mongoose from 'mongoose'

export interface IBSchema {
  id: string
  deletedAt?: Date
  isDeleted: boolean
  createdAt: Date
  updatedAt?: Date
}

export const schemaOptions = { timestamps: true }

export const baseSchema = new mongoose.Schema(
  {
    deletedAt: Date,
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  schemaOptions
)
