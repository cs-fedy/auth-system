import mongoose from 'mongoose'

export interface IBSchema {
  id: string
  createdAt: Date
  updatedAt?: Date
}

export const schemaOptions = { timestamps: true }

export const baseSchema = new mongoose.Schema({}, schemaOptions)
