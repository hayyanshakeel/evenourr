import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * GET /api/orders/[id] - Fetch a single order by ID
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = parseInt(params.id);

    if (isNaN(orderId)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
    }

    // Fetch order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Failed to fetch order:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

/**
 * PATCH /api/orders/[id] - Update an order
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = parseInt(params.id);
    const body = await request.json();

    if (isNaN(orderId)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
    }

    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Update order
    const updatedFields: any = {};

    // Only update provided fields
    const allowedFields = [
      'status', 'financialStatus', 'fulfillmentStatus',
      'note', 'tags', 'trackingNumber', 'trackingUrl',
      'shippingFirstName', 'shippingLastName', 'shippingCompany',
      'shippingAddress1', 'shippingAddress2', 'shippingCity',
      'shippingProvince', 'shippingCountry', 'shippingZip',
      'billingFirstName', 'billingLastName', 'billingCompany',
      'billingAddress1', 'billingAddress2', 'billingCity',
      'billingProvince', 'billingCountry', 'billingZip'
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updatedFields[field] = body[field];
      }
    }

    // Handle special date fields
    if (body.status === 'cancelled' && !existingOrder.cancelledAt) {
      updatedFields.cancelledAt = new Date();
    }

    if (body.status === 'delivered' && !existingOrder.closedAt) {
      updatedFields.closedAt = new Date();
    }

    if (body.status === 'processing' && !existingOrder.processedAt) {
      updatedFields.processedAt = new Date();
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updatedFields,
      include: {
        orderItems: {
          include: {
            product: true
          }
        }
      }
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Failed to update order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

/**
 * DELETE /api/orders/[id] - Delete an order
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = parseInt(params.id);

    if (isNaN(orderId)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
    }

    // Check if order exists
    const existingOrder = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (existingOrder.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Delete order items first
    await db.delete(orderItems).where(eq(orderItems.orderId, orderId));

    // Delete order
    await db.delete(orders).where(eq(orders.id, orderId));

    return NextResponse.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Failed to delete order:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
