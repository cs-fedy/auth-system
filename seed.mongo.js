/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
// TODO: Fix the problem of the date not matching mongodb timestamps[]
const bcrypt = require('bcrypt')
const MongoClient = require('mongodb').MongoClient

const baseDoc = { isDeleted: false }

const connectDb = async () => {
  const uri = 'mongodb://admin:admin@db:27017/'
  const client = new MongoClient(uri)
  return await client.connect()
}

connectDb().then(async (mongo) => {
  const resourcesCollection = mongo.db('test').collection('resources')
  const rolesCollection = mongo.db('test').collection('roles')
  const usersCollection = mongo.db('test').collection('users')
  console.log('connected to Mongodb 🥭 -- seeding db')

  //* seeding resources
  const resources = [
    {
      name: 'users',
      permissions: {
        read: true,
        write: true,
        update: true,
        delete: true,
      },
      ...baseDoc,
      createdAt: new Date().toJSON(),
      updatedAt: new Date().toJSON(),
    },
    {
      name: 'courses',
      permissions: {
        read: true,
        write: false,
        update: false,
        delete: false,
      },
      ...baseDoc,
      createdAt: new Date().toJSON(),
      updatedAt: new Date().toJSON(),
    },
  ]

  console.log('🌱 Seeding resources collection 🍀')
  const { insertedIds } = await resourcesCollection.insertMany(resources)

  //* seeding roles
  const roles = [
    {
      name: 'admin',
      resources: [insertedIds[0]],
      ...baseDoc,
      createdAt: new Date().toJSON(),
      updatedAt: new Date().toJSON(),
    },
    {
      name: 'student',
      resources: [insertedIds[1]],
      ...baseDoc,
      createdAt: new Date().toJSON(),
      updatedAt: new Date().toJSON(),
    },
  ]

  console.log('🌱 Seeding roles collection 🍀')
  const { insertedIds: insertedRolesIds } = await rolesCollection.insertMany(roles)
  //* seeding user -- create an admin
  const admin = {
    email: 'admin@platform.com',
    password: await bcrypt.hash('platform_password2022', 12),
    firstName: 'admin',
    lastName: 'platform',
    roles: [insertedRolesIds[0]],
    ...baseDoc,
    createdAt: new Date().toJSON(),
    updatedAt: new Date().toJSON(),
  }

  console.log('🌱 Seeding users collection 🍀')
  await await usersCollection.insertOne(admin)

  await mongo.close()
})
