import { Router } from 'express'
import * as ErrorLogController from '../controllers/errorLog.controller'

const router = Router()

/**
 * @swagger
 * /error-logs:
 *   get:
 *     summary: Get all error logs
 *     tags: [Error Logs]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *         description: Maximum number of error logs to return
 *     responses:
 *       200:
 *         description: List of error logs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ErrorLog'
 */
router.get('/', ErrorLogController.getErrorLogs)

/**
 * @swagger
 * /error-logs:
 *   post:
 *     summary: Log a frontend error
 *     tags: [Error Logs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateErrorLog'
 *     responses:
 *       200:
 *         description: Error logged successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', ErrorLogController.logFrontendError)

export default router
