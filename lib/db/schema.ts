// Drizzle schema - stub file for compatibility
// Note: This project primarily uses Prisma, but some components reference Drizzle schema

import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

export const coupons = sqliteTable('coupons', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  code: text('code').notNull().unique(),
  discount: real('discount').notNull(),
  validFrom: text('validFrom').notNull(),
  validUntil: text('validUntil').notNull(),
  maxUses: integer('maxUses').default(0),
  usedCount: integer('usedCount').default(0),
  isActive: integer('isActive', { mode: 'boolean' }).default(true),
  createdAt: text('createdAt').notNull(),
  updatedAt: text('updatedAt').notNull(),
});