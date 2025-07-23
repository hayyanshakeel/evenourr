import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';
import { productRelations, cartRelations, cartItemRelations, orderRelations, orderItemRelations, customerRelations } from './relations';

export const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export const db = drizzle(client, { schema: { ...schema, productRelations, cartRelations, cartItemRelations, orderRelations, orderItemRelations, customerRelations } });