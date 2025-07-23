import {
  sqliteTable,
  text,
  integer,
  real,
  primaryKey,
} from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';

// =================================================================
// T A B L E S
// Define all your tables here without any inline relations.
// =================================================================

export const products = sqliteTable('products', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique().$defaultFn(() => createId()),
  description: text('description'),
  price: real('price').notNull(),
  inventory: integer('inventory').notNull().default(0),
  imageUrl: text('imageUrl'),
  status: text('status', { enum: ['draft', 'active', 'archived'] }).notNull().default('draft'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const variants = sqliteTable('variants', {
    id: integer('id').primaryKey(),
    name: text('name').notNull(),
    value: text('value').notNull(),
    productId: integer('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
});

export const customers = sqliteTable('customers', {
  id: integer('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const coupons = sqliteTable('coupons', {
  id: integer('id').primaryKey(),
  code: text('code').notNull().unique(),
  discountType: text('discount_type').notNull(),
  discountValue: real('discount_value').notNull(),
  usageLimit: integer('usage_limit'),
  timesUsed: integer('times_used').default(0),
  expiresAt: integer('expires_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey(),
  customerId: integer('customer_id').references(() => customers.id),
  status: text('status').notNull().default('pending'),
  total: real('total').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const carts = sqliteTable('carts', {
  id: integer('id').primaryKey(),
  userId: integer('user_id').references(() => customers.id).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const orderItems = sqliteTable('order_items', {
    orderId: integer('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
    productId: integer('product_id').notNull().references(() => products.id),
    quantity: integer('quantity').notNull(),
    price: real('price').notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.orderId, t.productId] }),
  })
);

export const cartItems = sqliteTable('cart_items', {
    cartId: integer('cart_id').notNull().references(() => carts.id, { onDelete: 'cascade' }),
    productId: integer('product_id').notNull().references(() => products.id),
    quantity: integer('quantity').notNull().default(1),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.cartId, t.productId] }),
  })
);

// =================================================================
// R E L A T I O N S
// Define all table relations here at the end.
// =================================================================

export const productRelations = relations(products, ({ many }) => ({
    variants: many(variants),
    orderItems: many(orderItems),
    cartItems: many(cartItems),
}));

export const variantRelations = relations(variants, ({ one }) => ({
    product: one(products, {
        fields: [variants.productId],
        references: [products.id],
    }),
}));

export const customerRelations = relations(customers, ({ many }) => ({
    orders: many(orders),
    carts: many(carts),
}));

export const orderRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, { fields: [orders.customerId], references: [customers.id] }),
  orderItems: many(orderItems),
}));

export const cartRelations = relations(carts, ({ one, many }) => ({
  customer: one(customers, { fields: [carts.userId], references: [customers.id] }),
  cartItems: many(cartItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, { fields: [orderItems.productId], references: [products.id] }),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, { fields: [cartItems.cartId], references: [carts.id] }),
  product: one(products, { fields: [cartItems.productId], references: [products.id] }),
}));