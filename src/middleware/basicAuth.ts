import { Request, Response, NextFunction } from 'express'

export const basicAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.setHeader('WWW-Authenticate', 'Basic realm="API"')
    return res.status(401).json({ success: false, error: 'Authentication required' })
  }

  const base64Credentials = authHeader.split(' ')[1]
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8')
  const [username, password] = credentials.split(':')

  const validUsername = process.env.BASIC_AUTH_USER
  const validPassword = process.env.BASIC_AUTH_PASS

  if (username === validUsername && password === validPassword) {
    return next()
  }

  res.setHeader('WWW-Authenticate', 'Basic realm="API"')
  return res.status(401).json({ success: false, error: 'Invalid credentials' })
}
