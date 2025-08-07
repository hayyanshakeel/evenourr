import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseUser } from '@/lib/firebase-verify';
import { securityHeaders } from '@/lib/security';
import { ReturnsService } from '@/lib/services/returns';

export async function POST(
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
    
    if (!body.message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const update = await ReturnsService.addReturnUpdate(
      id,
      body.message,
      body.isPublic !== false, // Default to true if not specified
      verification.user.email
    );

    const response = NextResponse.json(update, { status: 201 });
    
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, String(value));
    });

    return response;
  } catch (error) {
    console.error('Error adding return update:', error);
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, String(value));
    });
    
    return response;
  }
}
