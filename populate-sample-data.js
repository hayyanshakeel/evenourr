// Script to populate Turso database with sample data for analytics testing
const { PrismaClient } = require('@prisma/client');
const { PrismaLibSQL } = require('@prisma/adapter-libsql');

async function populateSampleData() {
  let prisma;
  
  try {
    console.log('🏗️  Populating Turso database with sample data...');
    
    const url = process.env.TURSO_DATABASE_URL;
    const token = process.env.TURSO_AUTH_TOKEN;
    
    prisma = new PrismaClient({ 
      adapter: new PrismaLibSQL({ url, authToken: token }),
      log: ['error', 'warn']
    });

    // Check existing data
    const existingOrders = await prisma.order.count();
    const existingCustomers = await prisma.customer.count();
    
    if (existingOrders > 0) {
      console.log(`ℹ️  Found ${existingOrders} existing orders. Skipping data creation.`);
      return;
    }

  // Create sample customers
  console.log('👥 Creating sample customers...');
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: 'John Smith',
        email: 'john.smith@example.com'
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com'
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Mike Chen',
        email: 'mike.chen@example.com'
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Emily Davis',
        email: 'emily.davis@example.com'
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Robert Wilson',
        email: 'robert.w@example.com'
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Lisa Thompson',
        email: 'lisa.t@example.com'
      }
    })
  ]);    console.log(`✅ Created ${customers.length} customers`);

    // Get existing products
    const products = await prisma.product.findMany({
      take: 2
    });

    if (products.length === 0) {
      console.log('❌ No products found. Please add products first.');
      return;
    }

    console.log(`📦 Found ${products.length} products to use`);

    // Create sample orders with realistic dates
    console.log('🛒 Creating sample orders...');
    const now = new Date();
    const orders = [];

    // Create orders for the last 30 days
    for (let i = 0; i < 15; i++) {
      const orderDate = new Date(now.getTime() - (Math.random() * 30 * 24 * 60 * 60 * 1000));
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      const price = product.price * quantity;

      const order = await prisma.order.create({
        data: {
          customerId: customer.id,
          totalPrice: price,
          status: Math.random() > 0.1 ? 'completed' : 'pending',
          createdAt: orderDate,
          updatedAt: orderDate,
          orderItems: {
            create: {
              productId: product.id,
              quantity: quantity,
              price: product.price
            }
          }
        }
      });

      orders.push(order);
    }

    console.log(`✅ Created ${orders.length} sample orders`);

    // Summary
    const finalStats = {
      customers: await prisma.customer.count(),
      products: await prisma.product.count(),
      orders: await prisma.order.count(),
      totalRevenue: await prisma.order.aggregate({
        _sum: { totalPrice: true },
        where: { status: 'completed' }
      })
    };

    console.log('\n📊 Final database stats:');
    console.log(`👥 Customers: ${finalStats.customers}`);
    console.log(`📦 Products: ${finalStats.products}`);
    console.log(`🛒 Orders: ${finalStats.orders}`);
    console.log(`💰 Total Revenue: $${finalStats.totalRevenue._sum.totalPrice || 0}`);

    console.log('\n✅ Sample data population complete!');
    console.log('🎉 Analytics should now show real data instead of zeros.');

  } catch (error) {
    console.error('❌ Failed to populate sample data:', error.message);
    console.error(error);
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
}

populateSampleData();
