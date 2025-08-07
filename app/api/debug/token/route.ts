import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseUser } from '@/lib/firebase-verify';

export async function GET(request: NextRequest) {
  console.log('=== DEBUG TOKEN VERIFICATION ===');
  
  const result = await verifyFirebaseUser(request);
  
  if ('error' in result) {
    console.log('Token verification failed:', result.error);
    return NextResponse.json({ 
      success: false, 
      error: result.error,
      status: result.status
    }, { status: result.status });
  }

  const user = result.user;
  console.log('Token verification successful for user:', user.email);
  console.log('User role:', user.role);
  
  return NextResponse.json({ 
    success: true, 
    user: {
      id: user.id,
      email: user.email,
      role: user.role
    }
  });
}
