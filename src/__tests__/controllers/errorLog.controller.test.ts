import { Request, Response, NextFunction } from 'express'
import { ObjectId } from 'mongodb'
import { logFrontendError, getErrorLogs } from '../../controllers/errorLog.controller'
import * as ErrorLogModel from '../../models/errorLog.model'
import { mockRequest, mockResponse, mockNext } from '../mocks/express.mock'

jest.mock('../../models/errorLog.model')

const mockedErrorLogModel = ErrorLogModel as jest.Mocked<typeof ErrorLogModel>

describe('ErrorLog Controller', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction

  beforeEach(() => {
    req = mockRequest()
    res = mockResponse()
    next = mockNext
    jest.clearAllMocks()
  })

  describe('logFrontendError', () => {
    it('should log an error and return status 200', async () => {
      const errorData = {
        message: 'Test error message',
        stack: 'Error stack trace'
      }
      req = mockRequest({
        body: errorData,
        path: '/test-path',
        method: 'POST',
      })
      mockedErrorLogModel.logError.mockResolvedValue(undefined)

      await logFrontendError(req as Request, res as Response, next)

      expect(mockedErrorLogModel.logError).toHaveBeenCalledWith({
        source: 'frontend',
        message: 'Test error message',
        stack: 'Error stack trace',
        route: '/test-path',
        method: 'POST',
      })
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Error logged successfully',
      })
    })

    it('should call next with error when logError fails', async () => {
      const errorData = {
        message: 'Test error message',
        stack: 'Error stack trace'
      }
      req = mockRequest({
        body: errorData,
        path: '/test-path',
        method: 'POST',
      })
      const error = new Error('Database error')
      mockedErrorLogModel.logError.mockRejectedValue(error)

      await logFrontendError(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('getErrorLogs', () => {
    it('should return error logs with status 200', async () => {
      const mockLogs = [
        { _id: new ObjectId(), source: 'frontend', message: 'Error 1', },
        { _id: new ObjectId(), source: 'backend', message: 'Error 2', },
      ]
      mockedErrorLogModel.getErrors.mockResolvedValue(mockLogs)

      await getErrorLogs(req as Request, res as Response, next)

      expect(mockedErrorLogModel.getErrors).toHaveBeenCalledWith(100)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockLogs,
      })
    })

    it('should call next with error when getErrors fails', async () => {
      const error = new Error('Database error')
      mockedErrorLogModel.getErrors.mockRejectedValue(error)

      await getErrorLogs(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })
})
