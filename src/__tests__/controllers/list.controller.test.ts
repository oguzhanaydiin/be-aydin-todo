import { Request, Response, NextFunction } from 'express'
import { ObjectId } from 'mongodb'
import { getLists, createList, deleteList } from '../../controllers/list.controller'
import * as ListModel from '../../models/list.model'
import { List } from '../../models/list.model'
import { mockRequest, mockResponse, mockNext } from '../mocks/express.mock'

jest.mock('../../models/list.model')

const mockedListModel = ListModel as jest.Mocked<typeof ListModel>

describe('List Controller', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction

  beforeEach(() => {
    req = mockRequest()
    res = mockResponse()
    next = mockNext
    jest.clearAllMocks()
  })

  describe('getLists', () => {
    it('should return all lists with status 200', async () => {
      const mockLists: List[] = [
        { _id: new ObjectId(), name: 'Work', deleted: false, createdAt: new Date(), updatedAt: new Date() },
        { _id: new ObjectId(), name: 'Personal', deleted: false, createdAt: new Date(), updatedAt: new Date() },
      ]
      mockedListModel.findAll.mockResolvedValue(mockLists)

      await getLists(req as Request, res as Response, next)

      expect(mockedListModel.findAll).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockLists,
      })
    })

    it('should call next with error when findAll fails', async () => {
      const error = new Error('Database error')
      mockedListModel.findAll.mockRejectedValue(error)

      await getLists(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('createList', () => {
    it('should create a list and return status 200', async () => {
      const listData = { name: 'New List' }
      const createdList: List = { _id: new ObjectId(), ...listData, deleted: false, createdAt: new Date(), updatedAt: new Date() }
      req.body = listData
      mockedListModel.findByName.mockResolvedValue(null)
      mockedListModel.create.mockResolvedValue(createdList)

      await createList(req as Request, res as Response, next)

      expect(mockedListModel.findByName).toHaveBeenCalledWith('New List')
      expect(mockedListModel.create).toHaveBeenCalledWith(listData)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: createdList,
      })
    })

    it('should return 400 when list name already exists', async () => {
      const listData = { name: 'Existing List' }
      const existingList: List = { _id: new ObjectId(), ...listData, deleted: false, createdAt: new Date(), updatedAt: new Date() }
      req.body = listData
      mockedListModel.findByName.mockResolvedValue(existingList)

      await createList(req as Request, res as Response, next)

      expect(mockedListModel.findByName).toHaveBeenCalledWith('Existing List')
      expect(mockedListModel.create).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'List with this name already exists.',
      })
    })

    it('should call next with error when create fails', async () => {
      const listData = { name: 'New List' }
      req.body = listData
      mockedListModel.findByName.mockResolvedValue(null)
      const error = new Error('Database error')
      mockedListModel.create.mockRejectedValue(error)

      await createList(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('deleteList', () => {
    it('should delete a list and return status 200', async () => {
      req.params = { name: 'Test List' }
      mockedListModel.remove.mockResolvedValue({ success: true })

      await deleteList(req as Request, res as Response, next)

      expect(mockedListModel.remove).toHaveBeenCalledWith('Test List')
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'List deleted successfully',
      })
    })

    it('should return 400 when list deletion fails', async () => {
      req.params = { name: 'Test List' }
      mockedListModel.remove.mockResolvedValue({
        success: false,
        error: 'Cannot delete list "Test List" because 3 todo(s) are using it'
      })

      await deleteList(req as Request, res as Response, next)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Cannot delete list "Test List" because 3 todo(s) are using it',
      })
    })
  })
})
