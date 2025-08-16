// Test script to check Turso database connection and schema
const { PrismaClient } = require('@prisma/client');
const { PrismaLibSQL } = require('@prisma/adapter-libsql');

async function testTursoConnection() {
  let prisma;
  
  try {
    console.log('🔍 Testing Turso database connection...');
    
    // Create Turso client
    const url = process.env.TURSO_DATABASE_URL;
    const token = process.env.TURSO_AUTH_TOKEN;
    
    if (!url || !token) {
      throw new Error('Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN');
    }
    
    console.log(`🚀 Connecting to: ${url}`);
    
    prisma = new PrismaClient({ 
      adapter: new PrismaLibSQL({ url, authToken: token }),
      log: ['error', 'warn']
    });
    
    // Test basic connection
    await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database connection successful');
    
    // Check existing tables
    console.log('\n📋 Checking database schema...');
    
    // Check if we have any users
    const userCount = await prisma.user.count();
    console.log(`👥 Users: ${userCount}`);
    
    // Check if we have any products
    const productCount = await prisma.product.count();
    console.log(`📦 Products: ${productCount}`);
    
    // Check if we have any orders
    const orderCount = await prisma.order.count();
    console.log(`🛒 Orders: ${orderCount}`);
    
    // Check if we have any customers
    const customerCount = await prisma.customer.count();
    console.log(`👤 Customers: ${customerCount}`);
    
    if (productCount === 0) {
      console.log('\n⚠️  No sample data found. The analytics will show zero values.');
      console.log('💡 Consider adding some sample data for testing analytics.');
    }
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.error('💡 Make sure Turso credentials are correct and database is accessible');
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
}

testTursoConnection();
