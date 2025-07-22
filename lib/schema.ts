import { sql } from 'drizzle-orm';
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';

export const products = sqliteTable('products', {
  id: integer('id').primaryKey(),
  handle: text('handle').notNull().unique(),
  title: text('title').notNull(),
  description: text('description'),
  price: integer('price').notNull(),
  imageUrl: text('image_url'),
  inventory: integer('inventory').notNull().default(0),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
});

// You will add tables for orders, customers, etc. here later
