const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  console.log('🔍 Testing Turso database connection...');
  console.log('🚀 Connecting to:', process.env.TURSO_DATABASE_URL?.replace(/:[^:]*@/, ':***@'));

  try {
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connection successful');

    console.log('📋 Checking database schema...');
    
    // Test each table individually with better error handling
    try {
      const users = await prisma.user.count();
      console.log('👥 Users:', users);
      
      if (users > 0) {
        const sampleUser = await prisma.user.findFirst();
        console.log('   Sample user:', sampleUser?.email);
      }
    } catch (e) {
      console.log('👥 Users: Error -', e.message);
    }

    try {
      const products = await prisma.product.count();
      console.log('📦 Products:', products);
      
      if (products > 0) {
        const sampleProducts = await prisma.product.findMany({ take: 3 });
        console.log('   Sample products:');
        sampleProducts.forEach(p => console.log(`     - ${p.name}: $${p.price}`));
      }
    } catch (e) {
      console.log('📦 Products: Error -', e.message);
    }

    try {
      const orders = await prisma.order.count();
      console.log('🛒 Orders:', orders);
      
      if (orders > 0) {
        const totalRevenue = await prisma.order.aggregate({
          _sum: { totalPrice: true }
        });
        console.log('   Total Revenue: $', totalRevenue._sum.totalPrice || 0);
      }
    } catch (e) {
      console.log('🛒 Orders: Error -', e.message);
    }

    try {
      const customers = await prisma.customer.count();
      console.log('👤 Customers:', customers);
      
      if (customers > 0) {
        const sampleCustomers = await prisma.customer.findMany({ take: 3 });
        console.log('   Sample customers:');
        sampleCustomers.forEach(c => console.log(`     - ${c.name} (${c.email})`));
      }
    } catch (e) {
      console.log('👤 Customers: Error -', e.message);
    }

    try {
      const orderItems = await prisma.orderItem.count();
      console.log('📋 Order Items:', orderItems);
    } catch (e) {
      console.log('📋 Order Items: Error -', e.message);
    }

  } catch (error) {
    console.error('❌ Connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
