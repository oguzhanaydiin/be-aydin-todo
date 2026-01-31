import { z } from 'zod'

export const frontendErrorSchema = z.object({
  message: z.string().min(1, 'Error message is required'),
  stack: z.string().optional(),
  context: z.record(z.string(), z.any()).optional(),
})
