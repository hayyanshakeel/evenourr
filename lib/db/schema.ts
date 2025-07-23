import {
  mysqlTable,
  mysqlSchema,
  AnyMySqlColumn,
  primaryKey,
  unique,
  int,
  varchar,
  text,
  timestamp,
  mysqlEnum
} from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

// Main products table
export const products = mysqlTable('products', {
  id: int('id').autoincrement().primaryKey().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  price: int('price').notNull().default(0),
  imageUrl: varchar('image_url', { length: 2048 }),
  status: mysqlEnum('status', ['draft', 'active', 'archived']).notNull().default('draft'),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).onUpdateNow(),
});

// Product options table (e.g., "Size", "Color")
export const productOptions = mysqlTable('product_options', {
  id: int('id').autoincrement().primaryKey().notNull(),
  productId: int('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
});

// Product variants table (e.g., "Small / Red")
export const productVariants = mysqlTable('product_variants', {
  id: int('id').autoincrement().primaryKey().notNull(),
  productId: int('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  price: int('price').notNull().default(0),
  sku: varchar('sku', { length: 255 }),
  inventory: int('inventory').notNull().default(0),
});


// --- THIS IS THE FIX ---
// Explicitly define the relationships between the tables.
export const productRelations = relations(products, ({ many }) => ({
  options: many(productOptions),
  variants: many(productVariants),
}));

export const productOptionRelations = relations(productOptions, ({ one }) => ({
  product: one(products, {
    fields: [productOptions.productId],
    references: [products.id],
  }),
}));

export const productVariantRelations = relations(productVariants, ({ one }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
}));