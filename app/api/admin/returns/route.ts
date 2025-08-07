import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseUser } from '@/lib/firebase-verify';
import { securityHeaders } from '@/lib/security';
import { ReturnsService } from '@/lib/services/returns';

export async function GET(request: NextRequest) {
  // Verify authentication
  const verification = await verifyFirebaseUser(request);
  
  if (!verification.user) {
    return NextResponse.json(
      { error: verification.error || 'Unauthorized' },
      { status: verification.status || 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    
    const filters = {
      status: searchParams.get('status') || undefined,
      reasonCategory: searchParams.get('reasonCategory') || undefined,
      priority: searchParams.get('priority') || undefined,
      search: searchParams.get('search') || undefined,
      dateFrom: searchParams.get('dateFrom') ? new Date(searchParams.get('dateFrom')!) : undefined,
      dateTo: searchParams.get('dateTo') ? new Date(searchParams.get('dateTo')!) : undefined,
    };

    const result = await ReturnsService.getReturns(filters, page, limit);

    const response = NextResponse.json(result);
    
    // Add security headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    console.error('Error fetching returns:', error);
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
    
    // Validate required fields
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

    const returnData = {
      orderId: parseInt(body.orderId),
      userId: body.userId ? parseInt(body.userId) : undefined,
      customerId: body.customerId ? parseInt(body.customerId) : undefined,
      reason: body.reason,
      reasonCategory: body.reasonCategory,
      description: body.description,
      customerNotes: body.customerNotes,
      items: body.items.map((item: any) => ({
        productId: parseInt(item.productId),
        variantId: item.variantId ? parseInt(item.variantId) : undefined,
        quantity: parseInt(item.quantity),
        unitPrice: parseFloat(item.unitPrice),
        productName: item.productName,
        variantTitle: item.variantTitle,
      })),
    };

    const newReturn = await ReturnsService.createReturn(returnData);

    const response = NextResponse.json(newReturn, { status: 201 });
    
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    console.error('Error creating return:', error);
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    return response;
  }
}
