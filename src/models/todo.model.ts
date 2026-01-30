import { ObjectId } from 'mongodb'
import { getDB } from '../config/database'

const COLLECTION = 'todos'

export interface Todo {
  _id?: ObjectId
  title: string
  description?: string
  completed: boolean
  deleted: boolean
  deletedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface CreateTodoDto {
  title: string
  description?: string
  completed?: boolean
}

export interface UpdateTodoDto {
  title?: string
  description?: string
  completed?: boolean
}

export const findAll = async (): Promise<Todo[]> => {
  const db = getDB()
  return await db.collection<Todo>(COLLECTION).find({ deleted: false }).toArray()
}

export const findById = async (id: string): Promise<Todo | null> => {
  const db = getDB()
  return await db.collection<Todo>(COLLECTION).findOne({ _id: new ObjectId(id), deleted: false })
}

export const create = async (data: CreateTodoDto): Promise<Todo> => {
  const db = getDB()
  const now = new Date()
  const todo: Omit<Todo, '_id'> = {
    title: data.title,
    description: data.description,
    completed: data.completed || false,
    deleted: false,
    createdAt: now,
    updatedAt: now,
  }

  const result = await db.collection<Todo>(COLLECTION).insertOne(todo as Todo)
  return { ...todo, _id: result.insertedId }
}

export const update = async (id: string, data: UpdateTodoDto): Promise<Todo | null> => {
  const db = getDB()
  const now = new Date()

  const result = await db.collection<Todo>(COLLECTION).findOneAndUpdate(
    { _id: new ObjectId(id), deleted: false },
    {
      $set: {
        ...data,
        updatedAt: now
      }
    },
    { returnDocument: 'after' }
  )

  return result || null
}

export const remove = async (id: string): Promise<boolean> => {
  const db = getDB()
  const now = new Date()

  const result = await db.collection<Todo>(COLLECTION).updateOne(
    { _id: new ObjectId(id), deleted: false },
    {
      $set: {
        deleted: true,
        deletedAt: now,
        updatedAt: now
      }
    }
  )

  return result.modifiedCount > 0
}
