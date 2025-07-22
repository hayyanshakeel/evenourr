// lib/db/index.ts

import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
// Import everything from your schema file
import * as schema from './schema';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// Pass the full schema to the drizzle function
// This gives the 'db' object full knowledge of all your tables and relations
export const db = drizzle(client, { schema });