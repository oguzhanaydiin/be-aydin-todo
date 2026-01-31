import { Request, Response, NextFunction } from 'express'
import * as ErrorLogModel from '../models/errorLog.model'
import { frontendErrorSchema } from '../validation/errorLog.schema'

// Logging frontend errors
export const logFrontendError = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { message, stack } = frontendErrorSchema.parse(req.body)

    await ErrorLogModel.logError({
      source: 'frontend',
      message,
      stack,
      route: req.path,
      method: req.method,
    })

    return res.status(200).json({
      success: true,
      message: 'Error logged successfully',
    })
  } catch (error) {
    return next(error)
  }
}

export const getErrorLogs = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const logs = await ErrorLogModel.getErrors(100)

    return res.status(200).json({
      success: true,
      data: logs,
    })
  } catch (error) {
    return next(error)
  }
}
