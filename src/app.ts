import express, { Application, Request, Response } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import todoRoutes from './routes/todo.routes'
import errorLogRoutes from './routes/errorLog.routes'
import { errorHandler } from './middleware/errorHandler'

const app: Application = express()

app.use(helmet())
app.use(cors())
app.use(express.json())

app.use('/api/todos', todoRoutes)
app.use('/api/error-logs', errorLogRoutes)

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' })
})

// Global error handler
app.use(errorHandler)

export default app
