import { Request, Response, NextFunction } from 'express'
import * as TodoModel from '../models/todo.model'
import { createTodoSchema, updateTodoSchema, todoIdSchema } from '../validation/todo.schema'

export const getTodos = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const todos = await TodoModel.findAll()

    return res.status(200).json({
      success: true,
      data: todos,
    })
  } catch (error) {
    return next(error)
  }
}

export const getTodo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = todoIdSchema.parse(req.params)

    const todo = await TodoModel.findById(id)

    if (!todo) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found',
      })
    }

    return res.status(200).json({
      success: true,
      data: todo,
    })
  } catch (error) {
    return next(error)
  }
}

export const createTodo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validData = createTodoSchema.parse(req.body)

    const todo = await TodoModel.create(validData)

    return res.status(200).json({
      success: true,
      data: todo,
    })
  } catch (error) {
    return next(error)
  }
}

export const updateTodo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = todoIdSchema.parse(req.params)

    const validData = updateTodoSchema.parse(req.body)

    const todo = await TodoModel.update(id, validData)

    if (!todo) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found',
      })
    }

    return res.status(200).json({
      success: true,
      data: todo,
    })
  } catch (error) {
    return next(error)
  }
}

export const deleteTodo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = todoIdSchema.parse(req.params)

    const deleted = await TodoModel.remove(id)

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found or already deleted.',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Todo deleted successfully',
    })
  } catch (error) {
    return next(error)
  }
}
