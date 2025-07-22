// lib/db/schema.ts
import { sqliteTable, text, integer, unique } from 'drizzle-orm/sqlite-core';

export const products = sqliteTable('products', {
  id:            integer('id').primaryKey({ autoIncrement: true }),
  slug:          text('slug').unique().notNull(),
  name:          text('name').notNull(),
  description:   text('description'),
  price:         integer('price').notNull(),          // cents
  comparePrice:  integer('compare_price'),
  inventory:     integer('inventory').default(0),
  imageUrl:      text('image_url'),
  createdAt:     integer('created_at', { mode: 'timestamp' }).defaultNow(),
  updatedAt:     integer('updated_at', { mode: 'timestamp' }).defaultNow(),
});