import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseUser } from '@/lib/firebase-verify';
import { OrdersService } from '@/lib/admin-data';

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
