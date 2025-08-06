import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import crypto from 'crypto';

// Verify JWT token
function verifyJWT(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1] || ''));
    
    // Check expiration
    if (payload.exp && payload.exp < Date.now() / 1000) {
      return null;
    }
    
    // In production, verify signature with JWT_SECRET
    return payload;
  } catch (error) {
    return null;
  }
}

// Get current user session
export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const authToken = request.cookies.get('auth-token')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { error: 'No authentication token' },
        { status: 401 }
      );
    }
    
    // Verify JWT
    const payload = verifyJWT(authToken);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: parseInt(payload.sub) },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        emailVerified: true,
        lastLogin: true,
        createdAt: true,
      },
    });
    
    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: 'User not found or inactive' },
        { status: 401 }
      );
    }
    
    return NextResponse.json({
      success: true,
      user,
    });
    
  } catch (error) {
    console.error('Session verification error:', error);
    
    return NextResponse.json(
      { error: 'Session verification failed' },
      { status: 500 }
    );
  }
}
