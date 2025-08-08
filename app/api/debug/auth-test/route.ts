import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseUser } from '@/lib/firebase-verify';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  console.log('=== AUTH TEST DEBUG ===');
  console.log('Headers received:', Object.fromEntries(request.headers.entries()));
  
  const authHeader = request.headers.get('authorization');
  console.log('Authorization header:', authHeader);
  
  if (!authHeader) {
    console.log('❌ No Authorization header found');
    return NextResponse.json({ 
      error: 'No Authorization header',
      receivedHeaders: Object.fromEntries(request.headers.entries())
    }, { status: 401 });
  }

  // Test the verification
  const verification = await verifyFirebaseUser(request);
  console.log('Verification result:', verification);
  
  if (verification.user) {
    console.log('✅ Authentication successful for:', verification.user.email);
    return NextResponse.json({
      success: true,
      user: verification.user,
      email: verification.user.email
    });
  } else {
    console.log('❌ Authentication failed:', verification.error);
    return NextResponse.json({
      error: verification.error,
      status: verification.status
    }, { status: verification.status || 401 });
  }
}
