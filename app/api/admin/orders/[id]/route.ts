import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseUser } from '@/lib/firebase-verify';
import { OrdersService } from '@/lib/admin-data';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify Firebase token and get user
    const result = await verifyFirebaseUser(request);
    
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    const { user } = result;

    // Check if user has admin role
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const resolvedParams = await params;
    const orderId = parseInt(resolvedParams.id);
    
    if (isNaN(orderId)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
    }

    const order = await OrdersService.getById(orderId);
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Failed to fetch order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify Firebase token and get user
    const result = await verifyFirebaseUser(request);
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    const { user } = result;
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const resolvedParams = await params;
    const orderId = parseInt(resolvedParams.id);
    if (isNaN(orderId)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const allowedStatuses = ['pending','processing','paid','shipped','delivered','cancelled','refunded'];
    const nextStatus: string | undefined = typeof body?.status === 'string' ? body.status : undefined;

    const data: any = {};
    if (nextStatus && allowedStatuses.includes(nextStatus)) {
      data.status = nextStatus;
      if (nextStatus === 'processing' || nextStatus === 'paid') data.processedAt = new Date();
      if (nextStatus === 'delivered') data.closedAt = new Date();
      if (nextStatus === 'cancelled') data.cancelledAt = new Date();
    }
    // Optional additional fields (will be ignored by SQLite if columns are absent)
    if (typeof body?.shippingAddress === 'string') data.shippingAddress = body.shippingAddress;
    if (typeof body?.billingAddress === 'string') data.billingAddress = body.billingAddress;
    if (typeof body?.shippingMethod === 'string') data.shippingMethod = body.shippingMethod;
    if (typeof body?.paymentMethod === 'string') data.paymentMethod = body.paymentMethod;
    if (typeof body?.taxRate === 'number') data.taxRate = body.taxRate;
    if (typeof body?.notes === 'string') data.notes = body.notes;

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data,
      include: {
        orderItems: { include: { product: { select: { id: true, name: true, imageUrl: true } } } },
        customer: { select: { id: true, name: true, email: true } },
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
