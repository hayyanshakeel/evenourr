// drizzle.config.ts

import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  // Specifies the dialect is SQLite for Turso
  dialect: 'sqlite',

  // Explicitly points to your one and only schema file
  schema: './lib/db/schema.ts',

  // The directory where migration files will be generated
  out: './drizzle',

  // Configuration for connecting to your Turso database
  driver: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
});