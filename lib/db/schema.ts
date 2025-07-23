// lib/db/schema.ts

import { relations } from 'drizzle-orm';
import { integer, real, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

/**
 * Products Table
 * Stores all product information.
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
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

/**
 * Collections Table
 * Organizes products into categories.
 */
export const collections = sqliteTable('collections', {
    id: integer('id').primaryKey(),
    title: text('title').notNull(),
    handle: text('handle').notNull().unique(),
    description: text('description'),
    imageUrl: text('imageUrl'),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

/**
 * Products to Collections Junction Table
 * Creates a many-to-many relationship.
 */
export const productsToCollections = sqliteTable('products_to_collections', {
    productId: integer('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
    collectionId: integer('collection_id').notNull().references(() => collections.id, { onDelete: 'cascade' }),
});

/**
 * Carts Table
 * Represents a shopping cart.
 */
export const carts = sqliteTable('carts', {
    id: integer('id').primaryKey(),
    userId: text('user_id'),
    sessionId: text('session_id').unique(),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

/**
 * Cart Items Table
 * Stores individual products within each cart.
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


// --- RELATIONS ---

export const productsRelations = relations(products, ({ many }) => ({
    productsToCollections: many(productsToCollections),
    cartItems: many(cartItems),
}));

export const collectionsRelations = relations(collections, ({ many }) => ({
    productsToCollections: many(productsToCollections),
}));

export const productsToCollectionsRelations = relations(productsToCollections, ({ one }) => ({
    product: one(products, { fields: [productsToCollections.productId], references: [products.id] }),
    collection: one(collections, { fields: [productsToCollections.collectionId], references: [collections.id] }),
}));

export const cartsRelations = relations(carts, ({ many }) => ({
    items: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
    cart: one(carts, { fields: [cartItems.cartId], references: [carts.id] }),
    product: one(products, { fields: [cartItems.productId], references: [products.id] }),
}));