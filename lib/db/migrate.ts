import 'dotenv/config'; // Add this line at the very top
import { migrate } from 'drizzle-orm/libsql/migrator';
import { db, client } from './index';

async function main() {
  try {
    console.log('Running migrations...');
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('Migrations ran successfully!');
    client.close();
    process.exit(0);
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
}

main();