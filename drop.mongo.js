/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const MongoClient = require('mongodb').MongoClient

const connectDb = async () => {
  const uri = 'mongodb://admin:admin@localhost:27017/'
  const client = new MongoClient(uri)
  return await client.connect()
}

connectDb().then(async (mongo) => {
  const resourcesCollection = mongo.db('test').collection('resources')
  const rolesCollection = mongo.db('test').collection('roles')
  const usersCollection = mongo.db('test').collection('users')
  console.log('connected to Mongodb 🥭 -- dropping db collections')

  //* dropping resources
  console.log('🌱 Dropping resources collection 🍀')
  await resourcesCollection.deleteMany()

  //* dropping roles
  console.log('🌱 Dropping roles collection 🍀')
  await rolesCollection.deleteMany()

  //* dropping user
  console.log('🌱 Dropping users collection 🍀')
  await await usersCollection.deleteMany()

  await mongo.close()
})
