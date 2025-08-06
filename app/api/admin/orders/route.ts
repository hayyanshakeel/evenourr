import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseUser } from '@/lib/firebase-verify';
import { OrdersService } from '@/lib/admin-data';

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0;

    // Get real orders from database
    const result_data = await OrdersService.getAll({
      status,
      search,
      limit,
      offset
    });

    // Format response to match expected structure
    const response = {
      orders: result_data.orders,
      total: result_data.total,
      hasMore: (offset + limit) < result_data.total
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
