// lib/db/schema.ts
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// Helper function for consistent timestamps in SQLite
const timestamp = (name: string) => text(name).default(new Date().toISOString());

// --- TABLES ---

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name'),
  email: text('email').unique().notNull(),
  createdAt: timestamp('created_at').notNull(),
});

export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').unique().notNull(),
  name: text('name').notNull(),
  description: text('description'),
  price: integer('price').notNull(),
  status: text('status', { enum: ['active', 'draft', 'archived'] }).default('active'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

export const productOptions = sqliteTable('product_options', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  productId: integer('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
});

export const productVariants = sqliteTable('product_variants', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  productId: integer('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  price: integer('price').notNull(),
  inventory: integer('inventory').default(0),
  sku: text('sku'),
});

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  handle: text('handle').notNull().unique(),
  title: text('title').notNull(),
  createdAt: timestamp('created_at').notNull(),
});

export const productsToCategories = sqliteTable('products_to_categories', {
  productId: integer('product_id').notNull().references(() => products.id),
  categoryId: integer('category_id').notNull().references(() => categories.id),
});

export const coupons = sqliteTable('coupons', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  code: text('code').unique().notNull(),
  description: text('description'),
  discountType: text('discount_type', { enum: ['fixed', 'percentage'] }).notNull(),
  discountValue: real('discount_value').notNull(),
  usageLimit: integer('usage_limit'),
  usageCount: integer('usage_count').default(0).notNull(),
  status: text('status', { enum: ['active', 'disabled', 'expired'] }).default('active').notNull(),
  createdAt: timestamp('created_at').notNull(),
});

export const carts = sqliteTable('carts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),
  items: text('items', { mode: 'json' }),
  createdAt: timestamp('created_at').notNull(),
});

export const customers = sqliteTable('customers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name'),
  email: text('email').unique().notNull(),
  totalOrders: integer('total_orders').default(0),
  totalSpent: real('total_spent').default(0),
  createdAt: timestamp('created_at').notNull(),
});

export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),
  total: real('total').notNull(),
  status: text('status', { enum: ['pending', 'paid', 'shipped'] }).default('pending').notNull(),
  createdAt: timestamp('created_at').notNull(),
});


// --- RELATIONS ---

export const productsRelations = relations(products, ({ many }) => ({
  variants: many(productVariants),
  options: many(productOptions),
  categories: many(productsToCategories),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(productsToCategories),
}));

export const productsToCategoriesRelations = relations(productsToCategories, ({ one }) => ({
  product: one(products, { fields: [productsToCategories.productId], references: [products.id] }),
  category: one(categories, { fields: [productsToCategories.categoryId], references: [categories.id] }),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
}));