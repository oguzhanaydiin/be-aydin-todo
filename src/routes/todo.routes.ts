import { Router } from 'express'
import { getTodos, getTodo, createTodo } from '../controllers/todo.controller'

const router = Router()

router.get('/', getTodos)
router.get('/:id', getTodo)
router.post('/', createTodo)

export default router
