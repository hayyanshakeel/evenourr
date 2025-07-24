import 'dotenv/config';
import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';

// Ensure environment variables are set
const tursoUrl = process.env.TURSO_DATABASE_URL!;
const tursoToken = process.env.TURSO_AUTH_TOKEN!;

const client = createClient({
  url: tursoUrl,
  authToken: tursoToken,
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
    if (!latestFile) throw new Error('No latest migration file found.');
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
            error &&
            (error as any).message &&
            ((error as any).message.includes('already exists') ||
             (error as any).message.includes('no such table'))
          ) {
            console.warn(
              `⚠️ Skipped: ${stmt.substring(0, 50)}... — likely already exists or missing dependency`
            );
          } else {
            console.error('❌ Migration failed:', (error as any)?.message || error);
            process.exit(1);
          }
        }
      }
    }

    console.log('✅ Migrations applied successfully!');
  } catch (error: any) {
    console.error('❌ Error applying migrations:', (error as any)?.message || error);
    process.exit(1);
  }
}

main();