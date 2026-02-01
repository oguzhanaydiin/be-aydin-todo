import { Router } from 'express'
import { getLists, createList, deleteList } from '../controllers/list.controller'

const router = Router()

router.get('/', getLists)
router.post('/', createList)
router.delete('/:name', deleteList)

export default router
