// lib/db/schema.ts
import { sqliteTable, text, integer, unique } from 'drizzle-orm/sqlite-core';

export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').unique().notNull(),
  name: text('name').notNull(),
  description: text('description'),
  price: integer('price').notNull(), // cents
  comparePrice: integer('compare_price'),
  inventory: integer('inventory').default(0),
  imageUrl: text('image_url'),
  status: text('status').default('active'),
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).defaultNow(),
});

export const coupons = sqliteTable('coupons', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  code: text('code').unique().notNull(),
  type: text('type', { enum: ['fixed', 'percent'] }).notNull(),
  value: integer('value').notNull(),
  description: text('description'),
  minCart: integer('min_cart').default(0),
  maxUses: integer('max_uses').default(1),
  uses: integer('uses').default(0),
  startsAt: integer('starts_at', { mode: 'timestamp' }),
  expiresAt: integer('expires_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow(),
});

export const carts = sqliteTable('carts', {
  id: text('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow(),
});

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').unique().notNull(),
  password: text('password'),
  firstName: text('first_name'),
  lastName: text('last_name'),
  role: text('role', { enum: ['customer', 'admin'] }).default('customer'),
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow(),
});

export const customers = sqliteTable('customers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').unique().notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  state: text('state').default('enabled'),
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow(),
});

export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  total: integer('total').notNull(),
  status: text('status').default('pending'),
  createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow(),
});