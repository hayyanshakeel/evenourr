import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseUser } from '@/lib/firebase-verify';
import { OrdersService } from '@/lib/admin-data';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
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

    try {
      const stats = await OrdersService.getStats();
      // Respond with plain JSON for simpler client consumption
      return NextResponse.json(stats, { status: 200 });
    } catch (err) {
      console.error('Failed to fetch order stats:', err);
      // Safe defaults to prevent UI crashes
      return NextResponse.json({ total: 0, pending: 0, shipped: 0, cancelled: 0, recent: 0 }, { status: 200 });
    }
  } catch (error) {
    console.error('Unexpected error in /api/admin/orders/stats:', error);
    // Final safety net with defaults
    return NextResponse.json({ total: 0, pending: 0, shipped: 0, cancelled: 0, recent: 0 }, { status: 200 });
  }
}
