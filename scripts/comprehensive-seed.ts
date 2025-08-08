import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Upsert categories
    const electronics = await prisma.category.upsert({
      where: { name: 'Electronics' },
      update: {},
      create: { name: 'Electronics' },
    });

    const clothing = await prisma.category.upsert({
      where: { name: 'Clothing' },
      update: {},
      create: { name: 'Clothing' },
    });

    const accessories = await prisma.category.upsert({
      where: { name: 'Accessories' },
      update: {},
      create: { name: 'Accessories' },
    });

    console.log('✅ Categories created/updated');

    // Upsert collections
    const bestSellers = await prisma.collection.upsert({
      where: { handle: 'best-sellers' },
      update: {},
      create: {
        title: 'Best Sellers',
        handle: 'best-sellers',
        description: 'Our most popular products',
        imageUrl: 'https://via.placeholder.com/400x300',
      },
    });

    const newArrivals = await prisma.collection.upsert({
      where: { handle: 'new-arrivals' },
      update: {},
      create: {
        title: 'New Arrivals',
        handle: 'new-arrivals',
        description: 'Latest products in our store',
        imageUrl: 'https://via.placeholder.com/400x300',
      },
    });

    console.log('✅ Collections created/updated');

    // Upsert products
    const products = [
      {
        slug: 'wireless-headphones',
        data: {
          name: 'Wireless Headphones',
          description: 'High-quality wireless headphones with noise cancellation and premium sound quality',
          price: 199.99,
          inventory: 50,
          slug: 'wireless-headphones',
          imageUrl: 'https://via.placeholder.com/400x400',
          status: 'active',
          categoryId: electronics.id,
        },
      },
      {
        slug: 'cotton-t-shirt',
        data: {
          name: 'Cotton T-Shirt',
          description: 'Comfortable 100% cotton t-shirt available in multiple colors and sizes',
          price: 29.99,
          inventory: 100,
          slug: 'cotton-t-shirt',
          imageUrl: 'https://via.placeholder.com/400x400',
          status: 'active',
          categoryId: clothing.id,
          hasVariants: true,
        },
      },
      {
        slug: 'leather-wallet',
        data: {
          name: 'Leather Wallet',
          description: 'Premium genuine leather wallet with multiple card slots',
          price: 79.99,
          inventory: 25,
          slug: 'leather-wallet',
          imageUrl: 'https://via.placeholder.com/400x400',
          status: 'active',
          categoryId: accessories.id,
        },
      },
      {
        slug: 'bluetooth-speaker',
        data: {
          name: 'Bluetooth Speaker',
          description: 'Portable Bluetooth speaker with excellent sound quality and long battery life',
          price: 149.99,
          inventory: 30,
          slug: 'bluetooth-speaker',
          imageUrl: 'https://via.placeholder.com/400x400',
          status: 'active',
          categoryId: electronics.id,
        },
      },
      {
        slug: 'denim-jeans',
        data: {
          name: 'Denim Jeans',
          description: 'Classic fit denim jeans made from premium quality denim',
          price: 89.99,
          inventory: 75,
          slug: 'denim-jeans',
          imageUrl: 'https://via.placeholder.com/400x400',
          status: 'active',
          categoryId: clothing.id,
          hasVariants: true,
        },
      },
    ];

    for (const { slug, data } of products) {
      await prisma.product.upsert({
        where: { slug },
        update: data,
        create: data,
      });
    }

    console.log('✅ Products created/updated');

    // Upsert customers
    const customers = [
      {
        email: 'john.doe@example.com',
        name: 'John Doe',
      },
      {
        email: 'jane.smith@example.com',
        name: 'Jane Smith',
      },
      {
        email: 'bob.wilson@example.com',
        name: 'Bob Wilson',
      },
    ];

    for (const customer of customers) {
      await prisma.customer.upsert({
        where: { email: customer.email },
        update: customer,
        create: customer,
      });
    }

    console.log('✅ Customers created/updated');

    // Create some orders (only if they don't exist)
    const existingOrders = await prisma.order.count();
    if (existingOrders < 5) {
      const customer1 = await prisma.customer.findUnique({ where: { email: 'john.doe@example.com' } });
      const customer2 = await prisma.customer.findUnique({ where: { email: 'jane.smith@example.com' } });
      const product1 = await prisma.product.findUnique({ where: { slug: 'wireless-headphones' } });
      const product2 = await prisma.product.findUnique({ where: { slug: 'cotton-t-shirt' } });

      if (customer1 && customer2 && product1 && product2) {
        // Order 1
        const order1 = await prisma.order.create({
          data: {
            customerId: customer1.id,
            totalPrice: 199.99,
            status: 'completed',
            processedAt: new Date(),
          },
        });

        await prisma.orderItem.create({
          data: {
            orderId: order1.id,
            productId: product1.id,
            quantity: 1,
            price: 199.99,
          },
        });

        // Order 2
        const order2 = await prisma.order.create({
          data: {
            customerId: customer2.id,
            totalPrice: 59.98,
            status: 'pending',
          },
        });

        await prisma.orderItem.create({
          data: {
            orderId: order2.id,
            productId: product2.id,
            quantity: 2,
            price: 29.99,
          },
        });

        // Order 3
        const order3 = await prisma.order.create({
          data: {
            customerId: customer1.id,
            totalPrice: 229.98,
            status: 'completed',
            processedAt: new Date(),
          },
        });

        await prisma.orderItem.create({
          data: {
            orderId: order3.id,
            productId: product1.id,
            quantity: 1,
            price: 199.99,
          },
        });

        await prisma.orderItem.create({
          data: {
            orderId: order3.id,
            productId: product2.id,
            quantity: 1,
            price: 29.99,
          },
        });

        console.log('✅ Orders created');
      }
    } else {
      console.log('✅ Orders already exist, skipping...');
    }

    // Upsert admin user
    await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        password: 'hashed_password', // This should be properly hashed in real app
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isActive: true,
        emailVerified: true,
      },
    });

    console.log('✅ Admin user created/updated');

    // Create some return requests (only if they don't exist)
    const existingReturns = await prisma.returnRequest.count();
    if (existingReturns === 0) {
      const orders = await prisma.order.findMany({ take: 2 });
      if (orders.length > 0 && orders[0]) {
        const returnRequest = await prisma.returnRequest.create({
          data: {
            rmaNumber: 'RMA-2025-001',
            orderId: orders[0].id,
            customerId: orders[0].customerId,
            status: 'requested',
            reason: 'Product arrived damaged',
            reasonCategory: 'damaged',
            description: 'The product packaging was damaged and the item inside was scratched.',
            refundAmount: 199.99,
            refundMethod: 'original_payment',
            priority: 'normal',
            customerNotes: 'Please process this return as soon as possible.',
          },
        });

        // Add return items
        const orderItems = await prisma.orderItem.findMany({ 
          where: { orderId: orders[0].id },
          include: { product: true }
        });

        for (const item of orderItems) {
          await prisma.returnItem.create({
            data: {
              returnId: returnRequest.id,
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.price,
              totalPrice: item.price * item.quantity,
              condition: 'damaged',
              productName: item.product.name,
            },
          });
        }

        console.log('✅ Return requests created');
      }
    } else {
      console.log('✅ Return requests already exist, skipping...');
    }

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
