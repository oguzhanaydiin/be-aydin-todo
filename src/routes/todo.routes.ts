import { Router } from 'express'
import { getTodos } from '../controllers/todo.controller'

const router = Router()

router.get('/', getTodos)

export default router
