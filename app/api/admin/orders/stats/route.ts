import { NextResponse } from 'next/server';
import { OrdersService } from '@/lib/admin-data';

export async function GET() {
  try {
    const stats = await OrdersService.getStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Failed to fetch order stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order stats' },
      { status: 500 }
    );
  }
}
