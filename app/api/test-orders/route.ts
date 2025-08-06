import { NextResponse } from 'next/server';
import { OrdersService } from '@/lib/admin-data';

export async function GET() {
  try {
    console.log('Test endpoint: Fetching orders...');
    
    // Test direct database access
    const result = await OrdersService.getAll({});
    
    console.log('Test result:', { 
      ordersCount: result.orders.length, 
      total: result.total,
      firstOrder: result.orders[0] ? {
        id: result.orders[0].id,
        status: result.orders[0].status,
        totalPrice: result.orders[0].totalPrice,
        customer: result.orders[0].customer
      } : null
    });
    
    return NextResponse.json({ 
      success: true, 
      ordersCount: result.orders.length,
      total: result.total,
      orders: result.orders.map(order => ({
        id: order.id,
        status: order.status,
        totalPrice: order.totalPrice,
        customerName: order.customer?.name || 'No customer'
      }))
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
