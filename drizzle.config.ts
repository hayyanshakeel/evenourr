import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

// This line is essential
dotenv.config({ path: '.env.local' });

export default defineConfig({
  // Ensure this path is correct
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  driver: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!
  }
});