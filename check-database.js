const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  console.log('🔍 Checking Turso database contents...');

  try {
    // Check what tables exist by trying to query them
    const tables = ['User', 'Product', 'Customer', 'Order', 'OrderItem'];
    
    for (const table of tables) {
      try {
        const count = await prisma[table.toLowerCase()].count();
        console.log(`✅ ${table}: ${count} records`);
        
        if (count > 0) {
          const sample = await prisma[table.toLowerCase()].findFirst();
          console.log(`   Sample ${table}:`, Object.keys(sample));
        }
      } catch (error) {
        console.log(`❌ ${table}: Table does not exist or error - ${error.message}`);
      }
    }

    // Try to get specific data
    try {
      const users = await prisma.user.findMany({ take: 3 });
      console.log('\n👥 Users in database:');
      users.forEach(user => {
        console.log(`   - ${user.firstName} ${user.lastName} (${user.email}) - Role: ${user.role}`);
      });
    } catch (e) {
      console.log('Could not fetch users');
    }

    try {
      const products = await prisma.product.findMany({ take: 3 });
      console.log('\n📦 Products in database:');
      products.forEach(product => {
        console.log(`   - ${product.name} - $${product.price}`);
      });
    } catch (e) {
      console.log('Could not fetch products');
    }

  } catch (error) {
    console.error('❌ Database check failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
