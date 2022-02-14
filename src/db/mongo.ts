import mongoose from 'mongoose'
import { config } from '@configs'

export default () =>
  mongoose.connect(config.db.mongo.url, {
    user: config.db.mongo.user,
    pass: config.db.mongo.pass,
  })
