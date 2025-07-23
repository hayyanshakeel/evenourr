import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

// Validate required environment variables
const requiredEnvVars = ['TURSO_DATABASE_URL', 'TURSO_AUTH_TOKEN'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('\n❌ Missing required environment variables:');
  missingEnvVars.forEach(envVar => {
    console.error(`   - ${envVar}: ${process.env[envVar] || 'undefined'}`);
  });
  console.error('\nPlease set these variables in your .env file:');
  console.error('   TURSO_DATABASE_URL=libsql://your-database.turso.io');
  console.error('   TURSO_AUTH_TOKEN=your-auth-token-from-turso-dashboard');
  process.exit(1);
}

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  driver: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!
  },
  verbose: true,
  strict: true
});
