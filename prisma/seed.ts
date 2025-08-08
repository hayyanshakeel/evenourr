import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create categories
  const category1 = await prisma.category.create({
    data: {
      name: 'Electronics',
    },
  });

  const category2 = await prisma.category.create({
    data: {
      name: 'Clothing',
    },
  });

  console.log('✅ Categories created');

  // Create products
  const product1 = await prisma.product.create({
    data: {
      name: 'Wireless Headphones',
      description: 'High-quality wireless headphones with noise cancellation',
      price: 199.99,
      inventory: 50,
      slug: 'wireless-headphones',
      imageUrl: 'https://via.placeholder.com/300x300',
      status: 'active',
      categoryId: category1.id,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Cotton T-Shirt',
      description: 'Comfortable 100% cotton t-shirt',
      price: 29.99,
      inventory: 100,
      slug: 'cotton-t-shirt',
      imageUrl: 'https://via.placeholder.com/300x300',
      status: 'active',
      categoryId: category2.id,
      hasVariants: true,
    },
  });

  // Create product variants for t-shirt
  const variant1 = await prisma.productVariant.create({
    data: {
      productId: product2.id,
      title: 'Small - Blue',
      price: 29.99,
      sku: 'TSHIRT-S-BLUE',
      inventory: 25,
      position: 1,
    },
  });

  const variant2 = await prisma.productVariant.create({
    data: {
      productId: product2.id,
      title: 'Medium - Red',
      price: 29.99,
      sku: 'TSHIRT-M-RED',
      inventory: 30,
      position: 2,
    },
  });

  console.log('✅ Products and variants created');

  // Create customers
  const customer1 = await prisma.customer.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@example.com',
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
    },
  });

  console.log('✅ Customers created');

  // Create orders
  const order1 = await prisma.order.create({
    data: {
      customerId: customer1.id,
      totalPrice: 199.99,
      status: 'completed',
      processedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      orderItems: {
        create: [
          {
            productId: product1.id,
            quantity: 1,
            price: 199.99,
          },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      customerId: customer2.id,
      totalPrice: 59.98,
      status: 'pending',
      orderItems: {
        create: [
          {
            productId: product2.id,
            variantId: variant1.id,
            quantity: 2,
            price: 29.99,
          },
        ],
      },
    },
  });

  const order3 = await prisma.order.create({
    data: {
      customerId: customer1.id,
      totalPrice: 29.99,
      status: 'completed',
      processedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      orderItems: {
        create: [
          {
            productId: product2.id,
            variantId: variant2.id,
            quantity: 1,
            price: 29.99,
          },
        ],
      },
    },
  });

  console.log('✅ Orders created');

  // Create collections
  const collection1 = await prisma.collection.create({
    data: {
      title: 'Best Sellers',
      handle: 'best-sellers',
      description: 'Our most popular products',
      imageUrl: 'https://via.placeholder.com/400x300',
      productsToCollections: {
        create: [
          { productId: product1.id },
          { productId: product2.id },
        ],
      },
    },
  });

  console.log('✅ Collections created');

  // Create return requests
  const returnRequest1 = await prisma.returnRequest.create({
    data: {
      rmaNumber: 'RMA-001',
      orderId: order1.id,
      customerId: customer1.id,
      status: 'requested',
      reason: 'Product defective',
      reasonCategory: 'defective',
      description: 'The headphones stopped working after 2 days',
      refundAmount: 199.99,
      priority: 'high',
      customerNotes: 'Requesting full refund',
      returnItems: {
        create: [
          {
            productId: product1.id,
            quantity: 1,
            unitPrice: 199.99,
            totalPrice: 199.99,
            condition: 'defective',
            productName: product1.name,
          },
        ],
      },
    },
  });

  const returnRequest2 = await prisma.returnRequest.create({
    data: {
      rmaNumber: 'RMA-002',
      orderId: order3.id,
      customerId: customer1.id,
      status: 'approved',
      reason: 'Wrong size',
      reasonCategory: 'wrong_item',
      description: 'Ordered medium but received small',
      refundAmount: 29.99,
      priority: 'normal',
      approvedAt: new Date(),
      returnItems: {
        create: [
          {
            productId: product2.id,
            variantId: variant2.id,
            quantity: 1,
            unitPrice: 29.99,
            totalPrice: 29.99,
            condition: 'returned',
            productName: product2.name,
            variantTitle: variant2.title,
          },
        ],
      },
    },
  });

  console.log('✅ Return requests created');

  // Create coupons
  await prisma.coupon.create({
    data: {
      code: 'WELCOME10',
      discount: 10.0,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      maxUses: 100,
      usedCount: 5,
      isActive: true,
    },
  });

  await prisma.coupon.create({
    data: {
      code: 'SUMMER25',
      discount: 25.0,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      maxUses: 50,
      usedCount: 12,
      isActive: true,
    },
  });

  console.log('✅ Coupons created');

  // Summary
  const counts = {
    categories: await prisma.category.count(),
    products: await prisma.product.count(),
    variants: await prisma.productVariant.count(),
    customers: await prisma.customer.count(),
    orders: await prisma.order.count(),
    orderItems: await prisma.orderItem.count(),
    collections: await prisma.collection.count(),
    returnRequests: await prisma.returnRequest.count(),
    returnItems: await prisma.returnItem.count(),
    coupons: await prisma.coupon.count(),
  };

  console.log('🎉 Database seeding completed!');
  console.log('📊 Summary:', counts);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
