import express, { Application, Request, Response } from 'express'
import helmet from 'helmet'
import todoRoutes from './routes/todo.routes'

const app: Application = express()

app.use(helmet())
app.use(express.json())

app.use('/api/todos', todoRoutes)

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' })
})

export default app
