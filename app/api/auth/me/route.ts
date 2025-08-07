import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseUser } from '@/lib/firebase-verify';

export async function GET(request: NextRequest) {
  const result = await verifyFirebaseUser(request);
  
  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const user = result.user;
  
  // For auth/me endpoint, we just need to verify the user is authenticated
  // The actual token will be handled by the Authorization header
  return NextResponse.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
    },
    authenticated: true,
  });
}
