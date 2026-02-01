import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { Application } from 'express'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Aydin Todo API',
      version: '1.0.0',
      description: 'A Todo application API with lists and tasks management',
    },
    tags: [
      { name: 'Todos', description: 'Todo operations' },
      { name: 'Lists', description: 'List operations' },
      { name: 'Error Logs', description: 'Error logging' },
    ],
    servers: [
      {
        url: '/api',
        description: 'API server',
      },
    ],
    components: {
      schemas: {
        Todo: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'The auto-generated id of the todo',
            },
            title: {
              type: 'string',
              description: 'The title of the todo',
            },
            listName: {
              type: 'string',
              description: 'The name of the list this todo belongs to',
            },
            description: {
              type: 'string',
              description: 'Optional description of the todo',
            },
            completed: {
              type: 'boolean',
              description: 'Whether the todo is completed',
            },
            deleted: {
              type: 'boolean',
              description: 'Whether the todo is soft deleted',
            },
            deletedAt: {
              type: 'string',
              format: 'date-time',
              description: 'When the todo was deleted',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'When the todo was created',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'When the todo was last updated',
            },
          },
        },
        CreateTodo: {
          type: 'object',
          required: ['title', 'listName'],
          properties: {
            title: {
              type: 'string',
              description: 'The title of the todo',
            },
            listName: {
              type: 'string',
              description: 'The name of the list this todo belongs to',
            },
            description: {
              type: 'string',
              description: 'Optional description of the todo',
            },
            completed: {
              type: 'boolean',
              description: 'Whether the todo is completed',
              default: false,
            },
          },
        },
        UpdateTodo: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'The title of the todo',
            },
            description: {
              type: 'string',
              description: 'Optional description of the todo',
            },
            completed: {
              type: 'boolean',
              description: 'Whether the todo is completed',
            },
          },
        },
        List: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'The auto-generated id of the list',
            },
            name: {
              type: 'string',
              description: 'The name of the list',
            },
            deleted: {
              type: 'boolean',
              description: 'Whether the list is soft deleted',
            },
            deletedAt: {
              type: 'string',
              format: 'date-time',
              description: 'When the list was deleted',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'When the list was created',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'When the list was last updated',
            },
          },
        },
        CreateList: {
          type: 'object',
          required: ['name'],
          properties: {
            name: {
              type: 'string',
              description: 'The name of the list',
            },
          },
        },
        ErrorLog: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'The auto-generated id of the error log',
            },
            source: {
              type: 'string',
              enum: ['frontend', 'backend'],
              description: 'The source of the error',
            },
            message: {
              type: 'string',
              description: 'The error message',
            },
            stack: {
              type: 'string',
              description: 'The error stack trace',
            },
            route: {
              type: 'string',
              description: 'The route where the error occurred',
            },
            method: {
              type: 'string',
              description: 'The HTTP method',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'When the error occurred',
            },
          },
        },
        CreateErrorLog: {
          type: 'object',
          required: ['source', 'message'],
          properties: {
            source: {
              type: 'string',
              enum: ['frontend', 'backend'],
              description: 'The source of the error',
            },
            message: {
              type: 'string',
              description: 'The error message',
            },
            stack: {
              type: 'string',
              description: 'The error stack trace',
            },
            route: {
              type: 'string',
              description: 'The route where the error occurred',
            },
            method: {
              type: 'string',
              description: 'The HTTP method',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
}

const swaggerSpec = swaggerJsdoc(options)

export const setupSwagger = (app: Application): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

  // Serve swagger spec as JSON
  app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })
}
