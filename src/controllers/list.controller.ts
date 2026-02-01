import { Request, Response, NextFunction } from 'express'
import * as ListModel from '../models/list.model'
import { createListSchema, listNameSchema } from '../validation/list.schema'

export const getLists = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const lists = await ListModel.findAll()

    return res.status(200).json({
      success: true,
      data: lists,
    })
  } catch (error) {
    return next(error)
  }
}

export const createList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validData = createListSchema.parse(req.body)

    const existingList = await ListModel.findByName(validData.name)
    if (existingList) {
      return res.status(400).json({
        success: false,
        error: 'List with this name already exists.',
      })
    }

    const list = await ListModel.create(validData)

    return res.status(201).json({
      success: true,
      data: list,
    })
  } catch (error) {
    return next(error)
  }
}

export const deleteList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = listNameSchema.parse(req.params)

    const result = await ListModel.remove(name)

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
      })
    }

    return res.status(200).json({
      success: true,
      message: 'List deleted successfully',
    })
  } catch (error) {
    return next(error)
  }
}
