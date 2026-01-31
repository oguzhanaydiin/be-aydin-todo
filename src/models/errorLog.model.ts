import { getDB } from '../config/database'

const COLLECTION = 'errorLogs'

export const getErrors = async (limit = 100) => {
  const db = getDB()
  return db
    .collection(COLLECTION)
    .find()
    .sort({ timestamp: -1 })
    .limit(limit)
    .toArray()
}

export const logError = async (errorData: {
  source: 'frontend' | 'backend'
  message: string
  stack?: string
  route?: string
  method?: string
}) => {
  const db = getDB()
  await db.collection(COLLECTION).insertOne({
    ...errorData,
    timestamp: new Date(),
  })
}