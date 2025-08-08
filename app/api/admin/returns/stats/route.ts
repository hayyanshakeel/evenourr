import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseUser } from '@/lib/firebase-verify';
import { securityHeaders } from '@/lib/security';
import { ReturnsService } from '@/lib/services/returns';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  console.log('📈 [RETURNS STATS API] Starting GET request');
  
  // Verify authentication
  console.log('🔐 [RETURNS STATS API] Verifying Firebase user...');
  const verification = await verifyFirebaseUser(request);
  
  if (!verification.user) {
    console.error('❌ [RETURNS STATS API] Authentication failed:', verification.error);
    return NextResponse.json(
      { error: verification.error || 'Unauthorized' },
      { status: verification.status || 401 }
    );
  }

  console.log('✅ [RETURNS STATS API] User authenticated:', verification.user.email);

  try {
    const { searchParams } = new URL(request.url);
    const dateFrom = searchParams.get('dateFrom') ? new Date(searchParams.get('dateFrom')!) : undefined;
    const dateTo = searchParams.get('dateTo') ? new Date(searchParams.get('dateTo')!) : undefined;

    console.log('📊 [RETURNS STATS API] Date filters:', { 
      dateFrom: dateFrom?.toISOString(), 
      dateTo: dateTo?.toISOString(),
      url: request.url 
    });
    
    console.log('📞 [RETURNS STATS API] Calling ReturnsService.getReturnStats...');
    const stats = await ReturnsService.getReturnStats(dateFrom, dateTo);

    console.log('✅ [RETURNS STATS API] ReturnsService.getReturnStats completed successfully');
    console.log('📊 [RETURNS STATS API] Stats summary:', {
      totalReturns: stats.totalReturns || 0,
      pendingReturns: stats.pendingReturns || 0,
      completedReturns: stats.completedReturns || 0,
      totalRefundAmount: stats.totalRefundAmount || 0,
      returnRate: stats.returnRate || 0
    });
    
    const response = NextResponse.json(stats);
    
    // Add security headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    console.log('🎯 [RETURNS STATS API] Sending successful response');
    return response;
  } catch (error) {
    console.error('❌ [RETURNS STATS API] Error fetching return stats:', error);
    console.error('❌ [RETURNS STATS API] Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : 'No stack trace',
      name: error instanceof Error ? error.name : 'Unknown error type'
    });
    
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    return response;
  }
}
