import { z } from 'zod'

export const createListSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required and cannot be empty')
    .max(15, 'Name must be less than 15 characters'),
})

export const listNameSchema = z.object({
  name: z.string().min(1, 'Name is required'),
})
