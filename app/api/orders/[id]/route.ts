import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = parseInt(id);

    if (isNaN(orderId)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
    }

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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = parseInt(id);
    const body = await request.json();

    if (isNaN(orderId)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
    }

    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const updatedFields: any = {};
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