const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addSampleData() {
  try {
    console.log('🏪 Adding sample data...');

    // Create sample customers or get existing ones
    let customer1, customer2;
    
    try {
      customer1 = await prisma.customer.create({
        data: {
          name: 'John Doe',
          email: 'john@example.com',
        }
      });
    } catch (error) {
      customer1 = await prisma.customer.findUnique({
        where: { email: 'john@example.com' }
      });
    }

    try {
      customer2 = await prisma.customer.create({
        data: {
          name: 'Jane Smith', 
          email: 'jane@example.com',
        }
      });
    } catch (error) {
      customer2 = await prisma.customer.findUnique({
        where: { email: 'jane@example.com' }
      });
    }

    console.log('✅ Created/found customers');

    // Create sample products or get existing ones
    let product1, product2;
    
    try {
      product1 = await prisma.product.create({
        data: {
          name: 'Sample T-Shirt',
          description: 'A comfortable cotton t-shirt',
          price: 29.99,
          status: 'active',
          inventory: 100,
          slug: 'sample-t-shirt',
        }
      });
    } catch (error) {
      product1 = await prisma.product.findUnique({
        where: { slug: 'sample-t-shirt' }
      });
    }

    try {
      product2 = await prisma.product.create({
        data: {
          name: 'Sample Jeans',
          description: 'Comfortable denim jeans',
          price: 79.99,
          status: 'active',
          inventory: 50,
          slug: 'sample-jeans',
        }
      });
    } catch (error) {
      product2 = await prisma.product.findUnique({
        where: { slug: 'sample-jeans' }
      });
    }

    console.log('✅ Created/found products');

    // Count existing orders
    const existingOrdersCount = await prisma.order.count();
    
    if (existingOrdersCount === 0) {
      // Create sample orders
      const order1 = await prisma.order.create({
        data: {
          customerId: customer1.id,
          totalPrice: 29.99,
          status: 'paid',
          orderItems: {
            create: [
              {
                productId: product1.id,
                quantity: 1,
                price: 29.99,
              }
            ]
          }
        }
      });

      const order2 = await prisma.order.create({
        data: {
          customerId: customer2.id,
          totalPrice: 109.98,
          status: 'pending',
          orderItems: {
            create: [
              {
                productId: product1.id,
                quantity: 1,
                price: 29.99,
              },
              {
                productId: product2.id,
                quantity: 1,
                price: 79.99,
              }
            ]
          }
        }
      });

      const order3 = await prisma.order.create({
        data: {
          customerId: customer1.id,
          totalPrice: 159.98,
          status: 'fulfilled',
          orderItems: {
            create: [
              {
                productId: product2.id,
                quantity: 2,
                price: 79.99,
              }
            ]
          }
        }
      });

      console.log('✅ Created orders');
    } else {
      console.log('📦 Orders already exist, skipping creation');
    }

    console.log('🎉 Sample data setup completed!');

  } catch (error) {
    console.error('❌ Error adding sample data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addSampleData();
