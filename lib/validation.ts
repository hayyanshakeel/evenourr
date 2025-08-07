import { z } from 'zod';

// Input validation schemas
export const searchSchema = z.string().max(100).regex(/^[a-zA-Z0-9\s\-_.,@]+$/);
export const idSchema = z.number().int().positive();
export const limitSchema = z.number().int().min(1).max(100).default(20);
export const offsetSchema = z.number().int().min(0).default(0);

// Status validation for orders
export const orderStatusSchema = z.enum([
  'pending',
  'paid',
  'shipped',
  'delivered',
  'cancelled',
  'refunded'
]);

// Product validation
export const productQuerySchema = z.object({
  status: z.string().optional(),
  search: searchSchema.optional(),
  categoryId: idSchema.optional(),
  limit: limitSchema.optional(),
  offset: offsetSchema.optional(),
});

// Order validation
export const orderQuerySchema = z.object({
  status: orderStatusSchema.optional(),
  search: searchSchema.optional(),
  limit: limitSchema.default(20),
  offset: offsetSchema.default(0),
});

// Sanitization helper
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

// Rate limiting configuration
export const RATE_LIMITS = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
};
