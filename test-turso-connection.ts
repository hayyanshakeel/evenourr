import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';

async function testTursoConnection() {
  console.log('🧪 Testing Turso Connection...');
  
  const url = process.env.TURSO_DATABASE_URL;
  const token = process.env.TURSO_AUTH_TOKEN;
  
  console.log('Database URL:', url);
  console.log('Token length:', token?.length);
  
  if (!url || !token) {
    console.error('❌ Missing Turso credentials');
    return;
  }
  
  try {
    const prisma = new PrismaClient({ 
      adapter: new PrismaLibSQL({ url, authToken: token }) 
    } as any);
    
    console.log('✅ Prisma client created with Turso adapter');
    
    // Test simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Test query successful:', result);
    
    // Test creating a table
    await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS test_table (id INTEGER PRIMARY KEY, name TEXT)`;
    console.log('✅ Table creation successful');
    
    await prisma.$disconnect();
    console.log('✅ Turso connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Turso connection test failed:', error);
  }
}

export default testTursoConnection;
