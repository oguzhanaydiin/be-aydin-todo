import { MongoClient, Db } from 'mongodb'

let db: Db | null = null

export const connectDB = async (): Promise<Db> => {
  if (db) {
    return db
  }

  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('MONGODB_URI is not set')
  }
  const client = new MongoClient(uri)

  try {
    await client.connect()
    db = client.db()
    console.log('MongoDB connected successfully')
    return db
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}

export const getDB = (): Db => {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB first.')
  }
  return db
}
