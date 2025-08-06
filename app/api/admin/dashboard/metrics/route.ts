import { NextResponse } from 'next/server';
import { DashboardService } from '@/lib/admin-data';

export async function GET() {
  try {
    const metrics = await DashboardService.getMetrics();
    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Failed to fetch dashboard metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard metrics' },
      { status: 500 }
    );
  }
}
