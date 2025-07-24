import { integer, real, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

/**
 * Products Table
 */
export const products = sqliteTable('products', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  price: real('price').notNull(),
  inventory: integer('inventory').notNull().default(0),
  slug: text('slug').notNull().unique(),
  imageUrl: text('image_url'),
  status: text('status').notNull().default('active'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

/**
 * Collections Table
 */
export const collections = sqliteTable('collections', {
  id: integer('id').primaryKey(),
  title: text('title').notNull(),
  handle: text('handle').notNull().unique(),
  description: text('description'),
  imageUrl: text('image_url'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

/**
 * Products to Collections Junction Table
 */
export const productsToCollections = sqliteTable('products_to_collections', {
  productId: integer('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  collectionId: integer('collection_id').notNull().references(() => collections.id, { onDelete: 'cascade' }),
});

/**
 * Carts Table
 */
export const carts = sqliteTable('carts', {
  id: integer('id').primaryKey(),
  userId: text('user_id'),
  sessionId: text('session_id').unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

/**
 * Cart Items Table
 */
export const cartItems = sqliteTable('cart_items', {
  id: integer('id').primaryKey(),
  cartId: integer('cart_id').notNull().references(() => carts.id, { onDelete: 'cascade' }),
  productId: integer('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  quantity: integer('quantity').notNull().default(1),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
}, (table) => ({
  uniqueProductPerCart: uniqueIndex('unique_product_per_cart').on(table.cartId, table.productId),
}));

/**
 * Customers Table
 */
export const customers = sqliteTable('customers', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

/**
 * Orders Table
 */
export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey(),
  customerId: integer('customer_id').notNull().references(() => customers.id),
  totalPrice: real('total_price').notNull(),
  status: text('status').notNull().default('pending'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

/**
 * Order Items Table
 */
export const orderItems = sqliteTable('order_items', {
  id: integer('id').primaryKey(),
  orderId: integer('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  productId: integer('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  quantity: integer('quantity').notNull().default(1),
  price: real('price').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const coupons = sqliteTable('coupons', {
  id: integer('id').primaryKey(),
  code: text('code').notNull().unique(),
  discount: real('discount').notNull(), // e.g., 10% off
  validFrom: integer('valid_from', { mode: 'timestamp' }).notNull(),
  validUntil: integer('valid_until', { mode: 'timestamp' }).notNull(),
  maxUses: integer('max_uses').notNull().default(0),
  usedCount: integer('used_count').notNull().default(0),
  isActive: integer('is_active').notNull().default(1), // 1 = active, 0 = inactive
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});