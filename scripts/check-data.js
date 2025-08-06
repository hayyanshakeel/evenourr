const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkData() {
  try {
    console.log('🔍 Checking database data...');
    
    const orders = await prisma.order.findMany({
      include: {
        customer: true,
        orderItems: {
          include: {
            product: true
          }
        }
      }
    });
    
    console.log(`📦 Found ${orders.length} orders:`);
    orders.forEach(order => {
      console.log(`- Order #${order.id}: ${order.status}, Total: $${order.totalPrice}, Customer: ${order.customer?.name || 'N/A'}`);
    });
    
    const customers = await prisma.customer.findMany();
    console.log(`👥 Found ${customers.length} customers:`);
    customers.forEach(customer => {
      console.log(`- ${customer.name} (${customer.email})`);
    });
    
    const products = await prisma.product.findMany();
    console.log(`📋 Found ${products.length} products:`);
    products.forEach(product => {
      console.log(`- ${product.name}: $${product.price}, Status: ${product.status}`);
    });
    
  } catch (error) {
    console.error('❌ Error checking data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
