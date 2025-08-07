import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseUser } from '@/lib/firebase-verify';
import { securityHeaders } from '@/lib/security';
import { ReturnsService } from '@/lib/services/returns';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verify authentication
  const verification = await verifyFirebaseUser(request);
  
  if (!verification.user) {
    return NextResponse.json(
      { error: verification.error || 'Unauthorized' },
      { status: verification.status || 401 }
    );
  }

  try {
    const { id } = await params;
    const orderId = parseInt(id);
    
    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: 'Invalid order ID' },
        { status: 400 }
      );
    }

    const result = await ReturnsService.getReturnableItems(orderId);

    if (!result) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const response = NextResponse.json(result);
    
    // Add security headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, String(value));
    });

    return response;
  } catch (error) {
    console.error('Error fetching returnable items:', error);
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, String(value));
    });
    
    return response;
  }
}
