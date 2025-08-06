import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseUser } from '@/lib/firebase-verify';
import { CustomersService } from '@/lib/admin-data';

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
    const search = searchParams.get('search') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0;

    // Get real customers from database
    const result_data = await CustomersService.getAll({
      search,
      limit,
      offset
    });

    // Format response to match expected structure
    const response = {
      customers: result_data.customers,
      total: result_data.total,
      hasMore: (offset + limit) < result_data.total
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to fetch customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}
