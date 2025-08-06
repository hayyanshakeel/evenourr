import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseUser } from '@/lib/firebase-verify';
import { DashboardService } from '@/lib/admin-data';

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

    // Get real metrics from database
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
