import { Request, Response, NextFunction } from 'express'
import * as ErrorLogModel from '../models/errorLog.model'
import { ZodError } from 'zod'

export const errorHandler = async (
  err: Error | ZodError,
  req: Request,
  res: Response,
  // _next is mandatory
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  let statusCode = 500
  let message = err.message

  // validation errors coming from Zod = 400
  if (err instanceof ZodError) {
    statusCode = 400
    message = err.issues.map((issue) => issue.message).join(', ')
  }

  // Log error to MongoDB
  try {
    await ErrorLogModel.logError({
      source: 'backend',
      message,
      stack: err.stack,
      route: req.path,
      method: req.method,
    })
  } catch (logError) {
    console.error('Failed to log error:', logError)
  }

  // Send response
  return res.status(statusCode).json({
    success: false,
    error: message,
  })
}
