const { MongoClient, ObjectId } = require('mongodb')

let connectionInstance = null

async function connectToDatabase () {
  if (connectionInstance) return connectionInstance
  const client = new MongoClient(process.env.MONGODB_CONNECTIONSTRING, { connectTimeoutMS: process.env.MONGODB_TIMEOUT})
  try {
    const connection = await client.connect()
    connectionInstance = connection.db(process.env.MONGODB_DB_NAME)
  } catch (e) {
    console.error("MongoDB connection error", e)
  }
  return connectionInstance
}

async function getUserByCredentials(username, password) {
  const client = await connectToDatabase()
  if(!client) return null
  const collection = client.collection('users')
  const user = await collection.findOne({
    name: username,
    password
  })
  if (!user) return null
  return user
}

async function saveResultToDatabase(result) {
  const client = await connectToDatabase()
  if(!client) return null
  const collection = await client.collection('results')
  const { insertedId } = await collection.insertOne(result)
  return insertedId
}

async function getResultById(id){
  const client = await connectToDatabase()
  if(!client) return null
  const collection = await client.collection('results')
  const result = await collection.findOne({
    _id: new ObjectId(id)
  })
  if(!result) return null
  return result
}

module.exports = {
  getUserByCredentials,
  saveResultToDatabase,
  getResultById
}