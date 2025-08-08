import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseUser } from '@/lib/firebase-verify';
import { securityHeaders } from '@/lib/security';
import { ReturnsService } from '@/lib/services/returns';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  console.log('[RETURNS API] Starting GET request');
  
  // Verify authentication
  console.log('[RETURNS API] Verifying Firebase user...');
  const verification = await verifyFirebaseUser(request);
  
  if (!verification.user) {
    console.error('[RETURNS API] Authentication failed:', verification.error);
    return NextResponse.json(
      { error: verification.error || 'Unauthorized' },
      { status: verification.status || 401 }
    );
  }

  console.log('[RETURNS API] User authenticated:', verification.user.email);

  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    
    console.log('[RETURNS API] Request parameters:', { 
      page, 
      limit, 
      url: request.url 
    });
    
    const filters = {
      status: searchParams.get('status') || undefined,
      reasonCategory: searchParams.get('reasonCategory') || undefined,
      priority: searchParams.get('priority') || undefined,
      search: searchParams.get('search') || undefined,
      dateFrom: searchParams.get('dateFrom') ? new Date(searchParams.get('dateFrom')!) : undefined,
      dateTo: searchParams.get('dateTo') ? new Date(searchParams.get('dateTo')!) : undefined,
    };

    console.log('[RETURNS API] Applied filters:', filters);
    console.log('[RETURNS API] Calling ReturnsService.getReturns...');
    
    const result = await ReturnsService.getReturns(filters, page, limit);

    console.log('[RETURNS API] ReturnsService.getReturns completed successfully');
    console.log('[RETURNS API] Result summary:', {
      returnCount: result.returns?.length || 0,
      totalCount: result.pagination?.total || 0,
      page: result.pagination?.page || page,
      hasMore: result.pagination?.hasMore || false
    });
    
    const response = NextResponse.json(result);
    
    // Add security headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    console.log('[RETURNS API] Sending successful response');
    return response;
  } catch (error) {
    console.error('[RETURNS API] Error fetching returns:', error);
    console.error('[RETURNS API] Error details:', {
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

export async function POST(request: NextRequest) {
  // Verify authentication
  const verification = await verifyFirebaseUser(request);
  if (!verification.user) {
    return NextResponse.json(
      { error: verification.error || 'Unauthorized' },
      { status: verification.status || 401 }
    );
  }
  try {
    const body = await request.json();
    if (!body.orderId || !body.reason || !body.reasonCategory || !body.items || !Array.isArray(body.items)) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId, reason, reasonCategory, items' },
        { status: 400 }
      );
    }
    if (body.items.length === 0) {
      return NextResponse.json(
        { error: 'At least one item must be selected for return' },
        { status: 400 }
      );
    }
    const orderId = Number(body.orderId);
    if (!Number.isInteger(orderId) || orderId <= 0) {
      return NextResponse.json({ error: 'Invalid orderId' }, { status: 400 });
    }
    const items = body.items.map((item: any) => {
      const productId = Number(item.productId);
      const quantity = Number(item.quantity);
      const unitPrice = Number(item.unitPrice);
      if (!Number.isInteger(productId) || productId <= 0) throw new Error('Invalid productId');
      if (!Number.isInteger(quantity) || quantity <= 0) throw new Error('Invalid quantity');
      if (!Number.isFinite(unitPrice) || unitPrice < 0) throw new Error('Invalid unitPrice');
      return {
        productId,
        variantId: item.variantId ? Number(item.variantId) : undefined,
        quantity,
        unitPrice,
        productName: item.productName,
        variantTitle: item.variantTitle,
      };
    });
    const returnData = {
      orderId,
      userId: body.userId ? Number(body.userId) : undefined,
      customerId: body.customerId ? Number(body.customerId) : undefined,
      reason: body.reason,
      reasonCategory: body.reasonCategory,
      description: body.description,
      customerNotes: body.customerNotes,
      items,
    };
    // TODO: Fetch authoritative prices server-side to prevent client tampering
    const newReturn = await ReturnsService.createReturn(returnData);
    const response = NextResponse.json(newReturn, { status: 201 });
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  } catch (error) {
    console.error('Error creating return:', error);
    const status = error instanceof Error && /Invalid/.test(error.message) ? 400 : 500;
    const response = NextResponse.json({ error: status === 400 ? error instanceof Error ? error.message : 'Invalid input' : 'Internal server error' }, { status });
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  }
}
