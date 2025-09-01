import { NextRequest, NextResponse } from 'next/server';
import { requireEVRAdmin } from '@/lib/enterprise-auth';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  console.log('=== DEBUG TOKEN VERIFICATION ===');
  
  const verification = await requireEVRAdmin(request);
  
  if ('error' in result) {
    console.log('Token verification failed:', verification.error || 'Unauthorized');
    return NextResponse.json({ 
      success: false, 
      error: verification.error || 'Unauthorized',
      status: result.status
    }, { status: result.status });
  }

  const user = verification.user;
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
