import { Request, Response, NextFunction } from 'express'
import { ObjectId } from 'mongodb'
import { getTodos, createTodo, updateTodo, deleteTodo } from '../../controllers/todo.controller'
import * as TodoModel from '../../models/todo.model'
import { Todo } from '../../models/todo.model'
import { mockRequest, mockResponse, mockNext } from '../mocks/express.mock'

jest.mock('../../models/todo.model')

const mockedTodoModel = TodoModel as jest.Mocked<typeof TodoModel>

describe('Todo Controller', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction

  beforeEach(() => {
    req = mockRequest()
    res = mockResponse()
    next = mockNext
    jest.clearAllMocks()
  })

  describe('getTodos', () => {
    it('should return all todos with status 200', async () => {
      const mockTodos: Todo[] = [
        { _id: new ObjectId(), title: 'Test Todo 1', listName: 'default', completed: false, deleted: false, createdAt: new Date(), updatedAt: new Date() },
        { _id: new ObjectId(), title: 'Test Todo 2', listName: 'default', completed: true, deleted: false, createdAt: new Date(), updatedAt: new Date() },
      ]
      mockedTodoModel.findAll.mockResolvedValue(mockTodos)

      await getTodos(req as Request, res as Response, next)

      expect(mockedTodoModel.findAll).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockTodos,
      })
    })

    it('should call next with error when findAll fails', async () => {
      const error = new Error('Database error')
      mockedTodoModel.findAll.mockRejectedValue(error)

      await getTodos(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('createTodo', () => {
    it('should create a todo and return status 200', async () => {
      const todoData = { title: 'New Todo', listName: 'default', description: 'Test description' }
      const createdTodo: Todo = { _id: new ObjectId(), ...todoData, completed: false, deleted: false, createdAt: new Date(), updatedAt: new Date() }
      req.body = todoData
      mockedTodoModel.create.mockResolvedValue(createdTodo)

      await createTodo(req as Request, res as Response, next)

      expect(mockedTodoModel.create).toHaveBeenCalledWith(todoData)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: createdTodo,
      })
    })

    it('should call next with error for invalid data', async () => {
      req.body = { title: '' } // Invalid: empty title and missing listName

      await createTodo(req as Request, res as Response, next)

      expect(next).toHaveBeenCalled()
    })

    it('should call next with error when create fails', async () => {
      const todoData = { title: 'New Todo', listName: 'default' }
      req.body = todoData
      const error = new Error('Database error')
      mockedTodoModel.create.mockRejectedValue(error)

      await createTodo(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('updateTodo', () => {
    it('should update a todo and return status 200', async () => {
      const updateData = { title: 'Updated Todo', completed: true }
      const updatedTodo: Todo = { _id: new ObjectId(), ...updateData, listName: 'default', deleted: false, createdAt: new Date(), updatedAt: new Date() }
      req.params = { id: '507f1f77bcf86cd799439011' }
      req.body = updateData
      mockedTodoModel.update.mockResolvedValue(updatedTodo)

      await updateTodo(req as Request, res as Response, next)

      expect(mockedTodoModel.update).toHaveBeenCalledWith('507f1f77bcf86cd799439011', updateData)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: updatedTodo,
      })
    })

    it('should return 404 when todo to update is not found', async () => {
      req.params = { id: '507f1f77bcf86cd799439011' }
      req.body = { title: 'Updated Todo' }
      mockedTodoModel.update.mockResolvedValue(null)

      await updateTodo(req as Request, res as Response, next)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Todo not found',
      })
    })
  })

  describe('deleteTodo', () => {
    it('should delete a todo and return status 200', async () => {
      req.params = { id: '507f1f77bcf86cd799439011' }
      mockedTodoModel.remove.mockResolvedValue(true)

      await deleteTodo(req as Request, res as Response, next)

      expect(mockedTodoModel.remove).toHaveBeenCalledWith('507f1f77bcf86cd799439011')
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Todo deleted successfully',
      })
    })

    it('should return 404 when todo to delete is not found', async () => {
      req.params = { id: '507f1f77bcf86cd799439011' }
      mockedTodoModel.remove.mockResolvedValue(false)

      await deleteTodo(req as Request, res as Response, next)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Todo not found or already deleted.',
      })
    })
  })
})
