import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';

// Products Table: Stores all product information.
export const products = sqliteTable('products', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique().$defaultFn(() => createId()),
  description: text('description'),
  price: real('price').notNull(),
  inventory: integer('inventory').notNull().default(0),
  imageUrl: text('imageUrl'),
  status: text('status', { enum: ['draft', 'active', 'archived'] }).notNull().default('draft'),
  vendor: text('vendor'),
  collections: text('collections'),
  tags: text('tags'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Customers Table: Stores customer information.
export const customers = sqliteTable('customers', {
  id: integer('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  password: text('password'), // Reminder: Implement password hashing
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Orders Table: Stores order information.
export const orders = sqliteTable('orders', {
    id: integer('id').primaryKey(),
    customerId: integer('customer_id').references(() => customers.id),
    total: real('total').notNull(),
    status: text('status', { enum: ['pending', 'paid', 'shipped', 'cancelled'] }).default('pending'),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Order Items Table: Connects products to orders.
export const orderItems = sqliteTable('order_items', {
    id: integer('id').primaryKey(),
    orderId: integer('order_id').references(() => orders.id),
    productId: integer('product_id').references(() => products.id),
    quantity: integer('quantity').notNull(),
    price: real('price').notNull(),
});

// Coupons Table: Stores discount coupon information.
export const coupons = sqliteTable('coupons', {
  id: integer('id').primaryKey(),
  code: text('code').notNull().unique(),
  discount_type: text('discount_type', { enum: ['percentage', 'fixed'] }).notNull(),
  discount_value: real('discount_value').notNull(),
  expires_at: integer('expires_at', { mode: 'timestamp' }),
  created_at: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Carts Table: Stores shopping cart information for users.
export const carts = sqliteTable('carts', {
  id: integer('id').primaryKey(),
  userId: text('user_id').notNull().unique(), // Can be a session ID or customer ID
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Cart Items Table: Connects products to carts.
export const cartItems = sqliteTable('cart_items', {
  id: integer('id').primaryKey(),
  cartId: integer('cart_id').references(() => carts.id),
  productId: integer('product_id').references(() => products.id),
  quantity: integer('quantity').notNull().default(1),
});