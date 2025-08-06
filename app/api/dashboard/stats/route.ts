import { NextResponse } from 'next/server';
import { DashboardService } from '@/lib/admin-data';

export async function GET() {
  try {
    const metrics = await DashboardService.getMetrics();
    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' }, 
      { status: 500 }
    );
  }
}
