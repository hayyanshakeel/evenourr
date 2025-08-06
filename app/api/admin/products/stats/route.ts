import { NextResponse } from 'next/server';
import { ProductsService } from '@/lib/admin-data';

export async function GET() {
  try {
    const stats = await ProductsService.getStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Failed to fetch product stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product stats' },
      { status: 500 }
    );
  }
}
