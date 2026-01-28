import { Request, Response } from 'express'

export const getTodos = async (_: Request, res: Response) => {
  res.status(200).json({
    message: 'successful',
    data: [],
  })
}
