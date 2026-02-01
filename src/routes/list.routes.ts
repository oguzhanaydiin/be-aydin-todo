import { Router } from 'express'
import { getLists, createList, deleteList } from '../controllers/list.controller'

const router = Router()

/**
 * @swagger
 * /lists:
 *   get:
 *     summary: Get all lists
 *     tags: [Lists]
 *     responses:
 *       200:
 *         description: List of all lists
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/List'
 */
router.get('/', getLists)

/**
 * @swagger
 * /lists:
 *   post:
 *     summary: Create a new list
 *     tags: [Lists]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateList'
 *     responses:
 *       200:
 *         description: The created list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/List'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', createList)

/**
 * @swagger
 * /lists/{name}:
 *   delete:
 *     summary: Delete a list by name (soft delete)
 *     tags: [Lists]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: The list name
 *     responses:
 *       200:
 *         description: List deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: List not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:name', deleteList)

export default router
