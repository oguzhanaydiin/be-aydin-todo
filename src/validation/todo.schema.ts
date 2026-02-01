import { z } from 'zod'

export const createTodoSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required and cannot be empty')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .max(100, 'Description must be less than 100 characters')
    .optional(),
  listName: z
    .string()
    .max(15, 'list name must be less than 15 caharacters'),
  completed: z.boolean().optional(),
})

export const updateTodoSchema = z.object({
  title: z
    .string()
    .min(1, 'Title cannot be empty')
    .max(100, 'Title must be less than 100 characters')
    .optional(),
  description: z
    .string()
    .max(100, 'Description must be less than 100 characters')
    .optional(),
  completed: z.boolean().optional(),
})

export const todoIdSchema = z.object({
  id: z.string().length(24, 'Invalid todo ID format'),
})
