import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseUser } from '@/lib/firebase-verify';
import { DashboardService } from '@/lib/admin-data';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    // Check if the request has authorization header
    const authHeader = request.headers.get('authorization');
    
    // For development/testing: allow bypassing auth if no header is provided
    if (!authHeader && process.env.NODE_ENV === 'development') {
      console.log('Development mode: bypassing auth for metrics');
      const metrics = await DashboardService.getMetrics();
      console.log('Successfully fetched metrics without auth');
      return NextResponse.json(metrics);
    }
    
    if (!authHeader) {
      console.log('No authorization header found');
      return NextResponse.json({ error: 'Authorization required' }, { status: 401 });
    }

    const result = await verifyFirebaseUser(request);
    if ('error' in result) {
      console.log('Firebase verification failed:', result.error);
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    
    const { user } = result;
    if (user.role !== 'admin') {
      console.log('User is not admin, role:', user.role);
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    console.log('Fetching dashboard metrics for admin user:', user.email);
    const metrics = await DashboardService.getMetrics();
    console.log('Successfully fetched metrics');
    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Failed to fetch dashboard metrics:', error);
    // Return detailed error information in development
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    
    return NextResponse.json({ 
      error: 'Failed to fetch dashboard metrics',
      details: process.env.NODE_ENV === 'development' ? { message: errorMessage, stack: errorStack } : undefined
    }, { status: 500 });
  }
}
