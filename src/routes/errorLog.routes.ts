import { Router } from 'express'
import * as ErrorLogController from '../controllers/errorLog.controller'

const router = Router()

router.get('/', ErrorLogController.getErrorLogs)
router.post('/', ErrorLogController.logFrontendError)

export default router
