import { Request, Response } from 'express'
import { getDB } from '../config/database'

export const getTodos = async (_: Request, res: Response) => {
  try {
    const db = getDB()
    const todos = await db.collection('todos').find().toArray()
    
    res.status(200).json({
      success: true,
      data: todos,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch todos',
    })
  }
}
