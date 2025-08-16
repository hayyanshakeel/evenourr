const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🏗️  Creating sample data for analytics...');

  try {
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.customer.deleteMany();

    // Create customers using only required fields
    console.log('👥 Creating customers...');
    const customers = [];
    const customerData = [
      { name: 'John Smith', email: 'john.smith@example.com' },
      { name: 'Sarah Johnson', email: 'sarah.j@example.com' },
      { name: 'Mike Chen', email: 'mike.chen@example.com' },
      { name: 'Emily Davis', email: 'emily.davis@example.com' },
      { name: 'Robert Wilson', email: 'robert.w@example.com' }
    ];

    for (const data of customerData) {
      const customer = await prisma.customer.create({ data });
      customers.push(customer);
      console.log(`  ✅ Created customer: ${customer.name}`);
    }

    // Get existing products
    console.log('📦 Getting existing products...');
    const products = await prisma.product.findMany();
    console.log(`  Found ${products.length} products`);

    if (products.length === 0) {
      console.log('⚠️  No products found. Analytics will show $0 revenue.');
      return;
    }

    // Create sample orders
    console.log('🛒 Creating sample orders...');
    const orders = [];
    
    for (let i = 0; i < 15; i++) {
      const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      const orderTotal = randomProduct.price * quantity;
      
      // Create orders from different dates for analytics
      const daysAgo = Math.floor(Math.random() * 30);
      const orderDate = new Date();
      orderDate.setDate(orderDate.getDate() - daysAgo);

      const order = await prisma.order.create({
        data: {
          customerId: randomCustomer.id,
          totalPrice: orderTotal,
          status: ['pending', 'completed', 'shipped'][Math.floor(Math.random() * 3)],
          createdAt: orderDate,
          orderItems: {
            create: {
              productId: randomProduct.id,
              quantity: quantity,
              price: randomProduct.price
            }
          }
        }
      });
      
      orders.push(order);
      console.log(`  ✅ Created order: $${orderTotal.toFixed(2)} for ${randomCustomer.name}`);
    }

    console.log('✅ Sample data created successfully!');
    console.log(`📊 Summary:`);
    console.log(`   👥 Customers: ${customers.length}`);
    console.log(`   🛒 Orders: ${orders.length}`);
    console.log(`   💰 Total Revenue: $${orders.reduce((sum, order) => sum + order.totalPrice, 0).toFixed(2)}`);

  } catch (error) {
    console.error('❌ Error creating sample data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
