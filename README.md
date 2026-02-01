# Aydin Todo API
Backend API for the Aydin Todo application. Provides endpoints for managing lists, todos, and error logs.

preview: https://be-aydin-todo.onrender.com/api-docs

## Endpoints

### Todos
- `GET /todos` — Get all todos
- `POST /todos` — Create a new todo
- `GET /todos/:id` — Get a specific todo
- `PUT /todos/:id` — Update a todo
- `DELETE /todos/:id` — Delete a todo

### Lists
- `GET /lists` — Get all lists
- `POST /lists` — Create a new list
- `DELETE /lists/:name` — Delete a list by name

### Error Logs
- `GET /error-logs` — Get all error logs
- `POST /error-logs` — Log a frontend error

## Features
- RESTful API for todos, lists, and error logs
- MongoDB integration
- Input validation with Zod
- Centralized error handling
- Swagger API documentation
- Dockerized for easy deployment
- Covered with unit testing


### Environment Variables
Create a `.env` file in the root directory with the following variables:
```
PORT
MONGODB_URI
BASIC_AUTH_USER
BASIC_AUTH_PASS
```

### Running Locally
```sh
npm run start
```
The server will start on the port specified in `.env` (default: 3000).

### API Documentation
Swagger UI is available at `/api-docs` when the server is running.


### Docker Usage
Build and run the app with Docker:
```sh
docker build -t be-aydin-todo .
docker run -p 3000:3000 --env-file .env be-aydin-todo
```
Or use Docker Compose:
```sh
docker-compose up --build
```

## HTTP Status Codes
- **200** – Success
- **201** – Resource Created
- **400** – Bad Request (validation)
- **401** – Unauthorized
- **403** – Forbidden
- **404** – Not Found
- **500** – Server Error

Thank you for checking my project!
