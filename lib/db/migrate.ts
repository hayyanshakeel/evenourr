import 'dotenv/config';
// Migration functionality has been moved to Prisma
// Use: npx prisma migrate dev or npx prisma db push

console.log('Please use Prisma CLI for migrations:');
console.log('  npx prisma migrate dev    # For development migrations');
console.log('  npx prisma db push        # For prototype/development');
console.log('  npx prisma migrate deploy # For production');

process.exit(0);