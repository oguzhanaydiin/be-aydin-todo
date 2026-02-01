import { ObjectId } from 'mongodb'
import { getDB } from '../config/database'

const COLLECTION = 'lists'
const TODO_COLLECTION = 'todos'

export interface List {
  _id?: ObjectId
  name: string
  deleted: boolean
  deletedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface CreateListDto {
  name: string
}

export const findAll = async (): Promise<List[]> => {
  const db = getDB()
  return await db.collection<List>(COLLECTION).find({ deleted: false }).toArray()
}

export const findByName = async (name: string): Promise<List | null> => {
  const db = getDB()
  return await db.collection<List>(COLLECTION).findOne({ name, deleted: false })
}

export const create = async (data: CreateListDto): Promise<List> => {
  const db = getDB()
  const now = new Date()
  const list: Omit<List, '_id'> = {
    name: data.name,
    deleted: false,
    createdAt: now,
    updatedAt: now,
  }

  const result = await db.collection<List>(COLLECTION).insertOne(list as List)
  return { ...list, _id: result.insertedId }
}

export const remove = async (name: string): Promise<{ success: boolean; error?: string }> => {
  const db = getDB()

  // Check if list is not empty
  const todosWithListCount = await db.collection(TODO_COLLECTION).countDocuments({
    list: name,
    deleted: false
  })

  if (todosWithListCount > 0) {
    return {
      success: false,
      error: `Cannot delete list "${name}" because ${todosWithListCount} todo(s) are using it`
    }
  }

  const now = new Date()
  const result = await db.collection<List>(COLLECTION).updateOne(
    { name, deleted: false },
    {
      $set: {
        deleted: true,
        deletedAt: now,
        updatedAt: now
      }
    }
  )

  if (result.modifiedCount === 0) {
    return {
      success: false,
      error: 'List not found.'
    }
  }

  return { success: true }
}
