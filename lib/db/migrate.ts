import 'dotenv/config';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { db } from './index'; // Correctly import the 'db' object

async function main() {
  try {
    // This will run all pending migrations
    await migrate(db, { migrationsFolder: 'drizzle' });
    console.log('✅ Migrations completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during migration:', error);
    process.exit(1);
  }
}

main();