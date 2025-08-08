import { NextRequest, NextResponse } from 'next/server';
import { DashboardService } from '@/lib/admin-data';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing dashboard metrics endpoint...');
    const metrics = await DashboardService.getMetrics();
    console.log('Successfully fetched metrics:', metrics);
    return NextResponse.json({ success: true, data: metrics });
  } catch (error) {
    console.error('Failed to fetch dashboard metrics:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch dashboard metrics',
      details: { message: errorMessage, stack: errorStack }
    }, { status: 500 });
  }
}
