import { Request, Response, NextFunction } from 'express'

export const mockRequest = (overrides: Partial<Request> = {}): Partial<Request> => ({
  body: {},
  params: {},
  query: {},
  path: '/',
  method: 'GET',
  ...overrides,
})

export const mockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

export const mockNext: NextFunction = jest.fn()
