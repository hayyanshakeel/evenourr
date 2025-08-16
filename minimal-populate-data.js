const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🏗️  Creating minimal sample data for analytics...');

  try {
    // Check what tables exist
    console.log('🔍 Checking existing data...');
    
    try {
      const customerCount = await prisma.customer.count();
      console.log(`   Customers: ${customerCount}`);
    } catch (e) {
      console.log('   Customer table may not exist');
    }

    try {
      const orderCount = await prisma.order.count();
      console.log(`   Orders: ${orderCount}`);
    } catch (e) {
      console.log('   Order table may not exist');
    }

    // Try to create customers if the table exists
    console.log('👥 Creating customers...');
    const customers = [];
    
    try {
      const customerData = [
        { name: 'John Smith', email: 'john.smith@test.com' },
        { name: 'Sarah Johnson', email: 'sarah.j@test.com' },
        { name: 'Mike Chen', email: 'mike.chen@test.com' }
      ];

      for (const data of customerData) {
        const customer = await prisma.customer.create({ data });
        customers.push(customer);
        console.log(`  ✅ Created customer: ${customer.name}`);
      }
    } catch (error) {
      console.log(`  ❌ Could not create customers: ${error.message}`);
    }

    // Try to create orders if the table exists
    if (customers.length > 0) {
      console.log('🛒 Creating orders...');
      
      try {
        for (let i = 0; i < 5; i++) {
          const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
          const orderTotal = Math.floor(Math.random() * 200) + 50; // $50-$250
          
          const daysAgo = Math.floor(Math.random() * 30);
          const orderDate = new Date();
          orderDate.setDate(orderDate.getDate() - daysAgo);

          const order = await prisma.order.create({
            data: {
              customerId: randomCustomer.id,
              totalPrice: orderTotal,
              status: ['pending', 'completed', 'shipped'][Math.floor(Math.random() * 3)],
              createdAt: orderDate
            }
          });
          
          console.log(`  ✅ Created order: $${orderTotal} for ${randomCustomer.name}`);
        }
      } catch (error) {
        console.log(`  ❌ Could not create orders: ${error.message}`);
      }
    }

    // Final count
    console.log('📊 Final data summary:');
    try {
      const finalCustomers = await prisma.customer.count();
      const finalOrders = await prisma.order.count();
      console.log(`   👥 Customers: ${finalCustomers}`);
      console.log(`   🛒 Orders: ${finalOrders}`);
      
      if (finalOrders > 0) {
        const totalRevenue = await prisma.order.aggregate({
          _sum: { totalPrice: true }
        });
        console.log(`   💰 Total Revenue: $${totalRevenue._sum.totalPrice || 0}`);
      }
    } catch (e) {
      console.log('   Could not get final counts');
    }

    console.log('✅ Sample data creation completed!');

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
