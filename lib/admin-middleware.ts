/**
 * Admin Route Protection Middleware
 * Verifies admin authentication for protected routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/admin-auth';

export async function adminMiddleware(request: NextRequest) {
  try {
    // Check if admin is authenticated
    const verification = await adminAuth.verifyAdminToken(request);

    if (!verification.valid) {
      return NextResponse.json(
        { error: 'Admin authentication required' },
        { status: 401 }
      );
    }

    // Add admin session to request headers for downstream handlers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-admin-user', JSON.stringify({
      username: verification.session?.username,
      email: verification.session?.email,
      role: verification.session?.role
    }));

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error('Admin middleware error:', error);
    return NextResponse.json(
      { error: 'Authentication error' },
      { status: 500 }
    );
  }
}

/**
 * Helper function to get admin user from request headers
 */
export function getAdminFromRequest(request: NextRequest) {
  const adminHeader = request.headers.get('x-admin-user');
  if (adminHeader) {
    try {
      return JSON.parse(adminHeader);
    } catch (error) {
      console.error('Error parsing admin user from header:', error);
    }
  }
  return null;
}
