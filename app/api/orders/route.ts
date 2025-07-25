import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseUser } from '@/lib/firebase-verify';

export async function GET(request: NextRequest) {
  try {
    // Verify Firebase token and get user
    const result = await verifyFirebaseUser(request);
    
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    const { user } = result;

    // Check if user has admin role for viewing all orders
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const allOrders = await prisma.order.findMany({
      include: { 
        customer: true,
        orderItems: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Transform the data to match frontend interface
    const transformedOrders = allOrders.map(order => ({
      id: order.id,
      orderNumber: `ORD-${order.id.toString().padStart(6, '0')}`,
      customer: order.customer,
      total: Math.round(order.totalPrice * 100), // Convert to cents for frontend
      status: order.status,
      createdAt: order.createdAt.toISOString(),
      items: order.orderItems.map(item => ({
        title: item.product.name,
        quantity: item.quantity
      }))
    }));

    return NextResponse.json(transformedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}