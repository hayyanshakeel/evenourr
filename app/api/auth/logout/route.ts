import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// User logout
export async function POST(request: NextRequest) {
  try {
    // Get token from cookie
    const authToken = request.cookies.get('auth-token')?.value;
    
    if (authToken) {
      // Invalidate session in database
      try {
        await prisma.userSession.delete({
          where: { token: authToken },
        });
      } catch (error) {
        // Session might not exist in database, continue with logout
        console.log('Session not found in database:', error);
      }
    }
    
    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
    
    // Clear auth cookie
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Expire immediately
      path: '/',
    });
    
    return response;
    
  } catch (error) {
    console.error('Logout error:', error);
    
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
