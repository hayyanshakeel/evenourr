import 'dotenv/config';
import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';

// Validate required environment variables
const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;

if (!tursoUrl) {
  throw new Error('❌ TURSO_DATABASE_URL is not defined in environment variables');
}

if (!tursoToken) {
  throw new Error('❌ TURSO_AUTH_TOKEN is not defined in environment variables');
}

// Create client with properly typed variables
const client = createClient({
  url: tursoUrl as string,
  authToken: tursoToken as string
});

async function main() {
  try {
    // Find the latest fixed SQL file in the drizzle folder
    const drizzleDir = path.resolve(__dirname, '../drizzle');
    const files = fs.readdirSync(drizzleDir);
    const fixedFiles = files.filter(file => file.endsWith('_fixed.sql'));

    if (fixedFiles.length === 0) {
      throw new Error('No _fixed.sql files found in drizzle directory. Run `pnpm db:generate` first.');
    }

    // Sort to get the latest one
    fixedFiles.sort();
    const latestFile = fixedFiles[fixedFiles.length - 1];
    const sqlPath = path.join(drizzleDir, latestFile);

    console.log(`🔍 Using migration file: ${latestFile}`);

    const sqlContent = fs.readFileSync(sqlPath, 'utf-8');

    const statements = sqlContent
      .split(';')
      .filter((statement: string) => statement.trim().length > 0);

    console.log(`🚀 Applying ${statements.length} migration(s)...`);

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i].trim();
      if (!stmt.startsWith('--')) {
        try {
          await client.execute(stmt);
          console.log(`✅ Ran: ${stmt.substring(0, 50)}...`);
        } catch (error: any) {
          if (
            error.message && 
            (error.message.includes('already exists') ||
             error.message.includes('no such table'))
          ) {
            console.warn(
              `⚠️ Skipped: ${stmt.substring(0, 50)}... — likely already exists or missing dependency`
            );
          } else {
            throw error;
          }
        }
      }
    }

    console.log('✅ Migrations applied successfully!');
  } catch (error) {
    console.error('❌ Error applying migrations:', error);
    process.exit(1);
  }
}

main();
