import { NextRequest, NextResponse } from 'next/server';
import { verifyEVRAuth } from '@/lib/enterprise-auth';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Verify EVR token and get user
    const result = await verifyEVRAuth(request);
    
    if (!result.isValid || !result.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { user } = verification;

    // For now, return empty orders array since we need to establish the relationship
    // between Firebase users and local orders. This will be populated as users place orders.
    const orders: any[] = [];

    // Transform data for frontend
    const transformedOrders = orders.map(order => ({
      id: order.id.toString(),
      status: order.status,
      totalAmount: Number(order.totalPrice),
      createdAt: order.createdAt.toISOString(),
      items: order.orderItems?.map((item: any) => ({
        productName: item.product?.name || 'Unknown Product',
        quantity: item.quantity,
        price: Number(item.price)
      })) || []
    }));

    return NextResponse.json({ 
      success: true, 
      orders: transformedOrders,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('User orders error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
