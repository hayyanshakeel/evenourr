import { NextResponse } from 'next/server';
import { db } from '@/lib/turso';
import { orders, orderItems } from '@/lib/schema';
import { eq } from 'drizzle-orm';

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
    const orderResult = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (orderResult.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const order = orderResult[0];

    // Fetch order items
    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));

    return NextResponse.json({
      ...order,
      items
    });
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
    const existingOrder = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (existingOrder.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Update order
    const updatedFields: any = {
      updatedAt: new Date().toISOString()
    };

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
    const currentOrder = existingOrder[0]!;
    if (body.status === 'cancelled' && !currentOrder.cancelledAt) {
      updatedFields.cancelledAt = new Date().toISOString();
    }

    if (body.status === 'delivered' && !currentOrder.closedAt) {
      updatedFields.closedAt = new Date().toISOString();
    }

    if (body.status === 'processing' && !currentOrder.processedAt) {
      updatedFields.processedAt = new Date().toISOString();
    }

    const updatedOrder = await db
      .update(orders)
      .set(updatedFields)
      .where(eq(orders.id, orderId))
      .returning();

    // Fetch order items
    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));

    return NextResponse.json({
      ...updatedOrder[0],
      items
    });
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
