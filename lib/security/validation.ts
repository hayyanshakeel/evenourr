import { z } from 'zod';
import { SECURITY_CONFIG } from './config';

// Base validation schemas
export const baseSchemas = {
  id: z.number().int().positive(),
  uuid: z.string().uuid(),
  email: z.string().email().max(255),
  password: z.string().min(SECURITY_CONFIG.VALIDATION.MIN_PASSWORD_LENGTH).max(128),
  name: z.string().min(1).max(SECURITY_CONFIG.VALIDATION.MAX_STRING_LENGTH).trim(),
  description: z.string().max(SECURITY_CONFIG.VALIDATION.MAX_TEXT_LENGTH).trim().optional(),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, 'Invalid slug format'),
  url: z.string().url().max(500),
  price: z.number().positive().max(999999.99),
  inventory: z.number().int().min(0).max(999999),
  status: z.enum(['active', 'inactive', 'draft']),
};

// Product validation schemas
export const productSchemas = {
  create: z.object({
    name: baseSchemas.name,
    description: baseSchemas.description,
    price: baseSchemas.price,
    inventory: baseSchemas.inventory,
    status: baseSchemas.status,
    slug: baseSchemas.slug,
    categoryId: baseSchemas.id.optional(),
    imageUrls: z.array(baseSchemas.url).max(10).optional(),
  }),

  update: z.object({
    name: baseSchemas.name.optional(),
    description: baseSchemas.description,
    price: baseSchemas.price.optional(),
    inventory: baseSchemas.inventory.optional(),
    status: baseSchemas.status.optional(),
    slug: baseSchemas.slug.optional(),
    categoryId: baseSchemas.id.optional().nullable(),
    imageUrls: z.array(baseSchemas.url).max(10).optional(),
  }),

  query: z.object({
    status: baseSchemas.status.optional(),
    limit: z.number().int().min(1).max(100).optional().default(20),
    offset: z.number().int().min(0).optional().default(0),
    search: z.string().max(100).optional(),
    categoryId: baseSchemas.id.optional(),
  }),
};

// Collection validation schemas
export const collectionSchemas = {
  create: z.object({
    title: baseSchemas.name,
    handle: baseSchemas.slug,
    description: baseSchemas.description,
    imageUrl: baseSchemas.url.optional(),
  }),

  update: z.object({
    title: baseSchemas.name.optional(),
    handle: baseSchemas.slug.optional(),
    description: baseSchemas.description,
    imageUrl: baseSchemas.url.optional(),
  }),
};

// Order validation schemas
export const orderSchemas = {
  create: z.object({
    customerId: baseSchemas.id,
    items: z.array(z.object({
      productId: baseSchemas.id,
      quantity: z.number().int().min(1).max(999),
      price: baseSchemas.price,
    })).min(1).max(50),
    shippingAddress: z.object({
      street: z.string().min(1).max(200),
      city: z.string().min(1).max(100),
      state: z.string().min(1).max(100),
      zipCode: z.string().min(1).max(20),
      country: z.string().min(1).max(100),
    }),
    couponCode: z.string().max(50).optional(),
  }),

  update: z.object({
    status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
    trackingNumber: z.string().max(100).optional(),
  }),
};

// Customer validation schemas
export const customerSchemas = {
  create: z.object({
    email: baseSchemas.email,
    firstName: baseSchemas.name,
    lastName: baseSchemas.name,
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional(),
    dateOfBirth: z.string().datetime().optional(),
  }),

  update: z.object({
    firstName: baseSchemas.name.optional(),
    lastName: baseSchemas.name.optional(),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional(),
    dateOfBirth: z.string().datetime().optional(),
  }),
};

// Coupon validation schemas
export const couponSchemas = {
  create: z.object({
    code: z.string().min(3).max(20).regex(/^[A-Z0-9-]+$/, 'Invalid coupon code format'),
    type: z.enum(['percentage', 'fixed']),
    value: z.number().positive().max(100),
    minimumOrderValue: baseSchemas.price.optional(),
    maxUses: z.number().int().min(1).max(10000).optional(),
    expiresAt: z.string().datetime(),
    isActive: z.boolean().default(true),
  }),

  update: z.object({
    type: z.enum(['percentage', 'fixed']).optional(),
    value: z.number().positive().max(100).optional(),
    minimumOrderValue: baseSchemas.price.optional(),
    maxUses: z.number().int().min(1).max(10000).optional(),
    expiresAt: z.string().datetime().optional(),
    isActive: z.boolean().optional(),
  }),
};

// Authentication validation schemas
export const authSchemas = {
  register: z.object({
    email: baseSchemas.email,
    password: baseSchemas.password,
    firstName: baseSchemas.name,
    lastName: baseSchemas.name,
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }),

  login: z.object({
    email: baseSchemas.email,
    password: z.string().min(1, 'Password is required'),
  }),

  changePassword: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: baseSchemas.password,
    confirmNewPassword: z.string(),
  }).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords don't match",
    path: ["confirmNewPassword"],
  }),
};

// File upload validation
export const fileSchemas = {
  image: z.object({
    file: z.any().refine((file) => {
      if (!file) return false;
      return SECURITY_CONFIG.VALIDATION.ALLOWED_IMAGE_TYPES.includes(file.type);
    }, 'Invalid file type').refine((file) => {
      if (!file) return false;
      return file.size <= SECURITY_CONFIG.VALIDATION.MAX_FILE_SIZE;
    }, 'File too large'),
  }),
};

// API parameter validation
export const paramSchemas = {
  id: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid ID format').transform(Number),
  }),
  
  code: z.object({
    code: z.string().min(1).max(50),
  }),
  
  handle: z.object({
    handle: baseSchemas.slug,
  }),
};

// Utility function to validate and sanitize input
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    const errors = result.error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    
    throw new ValidationError('Input validation failed', errors);
  }
  
  return result.data;
}

// Custom validation error class
export class ValidationError extends Error {
  constructor(
    message: string,
    public errors: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Sanitization utilities
export function sanitizeHtml(input: string): string {
  // For now, we'll use basic sanitization
  // In production, you should use a proper HTML sanitizer
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export function sanitizeString(input: string): string {
  return input.trim().replace(/[\x00-\x1F\x7F]/g, '');
}
