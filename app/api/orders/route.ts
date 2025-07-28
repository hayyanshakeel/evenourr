import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching orders from database...');
    const allOrders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' }
    });
    console.log('Orders fetched successfully:', allOrders.length);

    // Transform the data to match frontend interface
    const orders = allOrders.map(order => ({
      id: order.id,
      customerId: order.customerId,
      totalPrice: order.totalPrice,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    }));

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Creating new order:', body);

    const {
      customerId,
      customerName,
      customerEmail,
      items,
      subtotal,
      taxAmount,
      shippingAmount,
      discountAmount,
      total,
      notes,
    } = body;

    // Validate required fields
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Order must contain at least one item' }, { status: 400 });
    }

    let finalCustomerId = customerId;

    // If no customerId but we have customer details, create or find customer
    if (!customerId && (customerName || customerEmail)) {
      if (customerEmail) {
        // Try to find existing customer by email
        let customer = await prisma.customer.findUnique({
          where: { email: customerEmail }
        });

        // If not found, create new customer
        if (!customer) {
          customer = await prisma.customer.create({
            data: {
              name: customerName || customerEmail,
              email: customerEmail,
            }
          });
        }
        finalCustomerId = customer.id;
      }
    }

    // Create the order with transaction to ensure atomicity
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          customerId: finalCustomerId,
          totalPrice: total,
          status: 'pending',
        }
      });

      // Create order items
      const orderItems = await Promise.all(
        items.map((item: any) =>
          tx.orderItem.create({
            data: {
              orderId: newOrder.id,
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            }
          })
        )
      );

      // Update product inventory
      await Promise.all(
        items.map((item: any) =>
          tx.product.update({
            where: { id: item.productId },
            data: {
              inventory: {
                decrement: item.quantity
              }
            }
          })
        )
      );

      return newOrder;
    });

    console.log('Order created successfully:', order.id);
    return NextResponse.json({ id: order.id, message: 'Order created successfully' });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}