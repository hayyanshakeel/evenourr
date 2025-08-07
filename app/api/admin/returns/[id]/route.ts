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
    const returnRecord = await ReturnsService.getReturnById(id);

    if (!returnRecord) {
      return NextResponse.json(
        { error: 'Return not found' },
        { status: 404 }
      );
    }

    const response = NextResponse.json(returnRecord);
    
    // Add security headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    console.error('Error fetching return:', error);
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    return response;
  }
}

export async function PUT(
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
    const body = await request.json();
    
    const updateData = {
      status: body.status,
      refundAmount: body.refundAmount ? parseFloat(body.refundAmount) : undefined,
      refundMethod: body.refundMethod,
      priority: body.priority,
      trackingNumber: body.trackingNumber,
      carrierName: body.carrierName,
      returnLabel: body.returnLabel,
      processedBy: body.processedBy || verification.user.email,
      adminNotes: body.adminNotes,
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => 
      updateData[key as keyof typeof updateData] === undefined && delete updateData[key as keyof typeof updateData]
    );

    const updatedReturn = await ReturnsService.updateReturn(
      id,
      updateData,
      verification.user.email
    );

    const response = NextResponse.json(updatedReturn);
    
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    console.error('Error updating return:', error);
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    return response;
  }
}
