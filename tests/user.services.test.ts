import assert from 'assert'

// Set up minimal environment variables expected by the config loader
process.env.MONGODB_URL = 'mongodb://localhost:27017/test'
process.env.MONGODB_USER = 'user'
process.env.MONGODB_PASS = 'pass'
process.env.REDIS_PORT = '6379'
process.env.REDIS_HOST = 'localhost'
process.env.JWT_SECRET = 'secret'
process.env.SENDGRID_API_KEY = 'key'
process.env.EMAIL_SENDER = 'sender@example.com'
process.env.NODE_ENV = 'test'

import path from 'path'
import Module from 'module'

// Stub the jobs module to avoid initializing Redis connections during tests
const jobsPath = path.join(__dirname, '../src/jobs/index.ts')
const jobsMock = new Module(jobsPath)
jobsMock.exports = { sendEmail: () => {}, destroyAccount: () => {} }
require.cache[require.resolve(jobsPath)] = jobsMock

// Stub the models module to avoid importing database clients
const modelsPath = path.join(__dirname, '../src/models/index.ts')
const userDao = { updateUserById: async (_id: string, update: any) => ({ id: _id, ...update }) }
const modelsMock = new Module(modelsPath)
modelsMock.exports = { DAOUser: userDao }
require.cache[require.resolve(modelsPath)] = modelsMock

import UserServices from '../src/services/user.services'

async function testUpdateLastName() {
  const userId = 'user123'
  const newLastName = 'Doe'

  let receivedId: string | null = null
  let receivedUpdate: any = null

  // Save original function to restore later
  const originalUpdate = userDao.updateUserById
  userDao.updateUserById = async (id: string, update: any) => {
    receivedId = id
    receivedUpdate = update
    return { id, ...update } as any
  }

  const result = await UserServices.updateLastName(userId, newLastName)

  // Restore original function
  userDao.updateUserById = originalUpdate

  assert.strictEqual(receivedId, userId)
  assert.deepStrictEqual(receivedUpdate, { lastName: newLastName })
  assert.strictEqual(result.lastName, newLastName)
}

async function run() {
  await testUpdateLastName()
  console.log('All tests passed')
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
