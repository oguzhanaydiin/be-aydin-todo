import { Request, Response } from 'express'
import * as TodoModel from '../models/todo.model'

export const getTodos = async (_: Request, res: Response) => {
  try {
    const todos = await TodoModel.findAll()
    
    return res.status(200).json({
      success: true,
      data: todos,
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: 'Failed to fetch todos',
    })
  }
}

export const getTodo = async (req: Request, res: Response) => {
  try {
    const todo = await TodoModel.findById(req.params.id)
    
    if (!todo) {
      return res.status(400).json({
        success: false,
        error: 'Todo not found',
      })
    }
    
    return res.status(200).json({
      success: true,
      data: todo,
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: 'Failed to fetch todo',
    })
  }
}

export const createTodo = async (req: Request, res: Response) => {
  try {
    const todo = await TodoModel.create(req.body)
    
    return res.status(200).json({
      success: true,
      data: todo,
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: 'Failed to create todo',
    })
  }
}
