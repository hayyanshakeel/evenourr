import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseUser } from '@/lib/firebase-verify';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  emailVerified: boolean;
}

export class AuthenticationError extends Error {
  constructor(message: string, public status: number = 401) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  constructor(message: string, public status: number = 403) {
    super(message);
    this.name = 'AuthorizationError';
  }
}

/**
 * Universal authentication middleware for all protected routes
 * Provides consistent Firebase token validation across the entire platform
 */
export async function requireAuth(request: NextRequest): Promise<AuthenticatedUser> {
  try {
    const result = await verifyFirebaseUser(request);
    
    if ('error' in result) {
      throw new AuthenticationError(result.error || 'Authentication failed', result.status || 401);
    }

    if (!result.user) {
      throw new AuthenticationError('No user found in authentication result');
    }

    // Validate user is active
    if (!result.user.isActive) {
      throw new AuthenticationError('Account is deactivated');
    }

    return result.user as AuthenticatedUser;
  } catch (error) {
    if (error instanceof AuthenticationError) {
      throw error;
    }
    
    console.error('Authentication error:', error);
    throw new AuthenticationError('Authentication failed');
  }
}

/**
 * Require specific role for access
 */
export async function requireRole(request: NextRequest, requiredRole: string | string[]): Promise<AuthenticatedUser> {
  const user = await requireAuth(request);
  
  const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  
  if (!allowedRoles.includes(user.role)) {
    throw new AuthorizationError(`Access denied. Required role: ${allowedRoles.join(' or ')}`);
  }
  
  return user;
}

/**
 * Admin-only access
 */
export async function requireAdmin(request: NextRequest): Promise<AuthenticatedUser> {
  return requireRole(request, ['admin', 'super-admin']);
}

/**
 * Session timeout enforcement
 */
export async function enforceSessionTimeout(request: NextRequest): Promise<void> {
  const sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours
  const tokenHeader = request.headers.get('authorization');
  
  if (!tokenHeader) {
    throw new AuthenticationError('No authorization header');
  }
  
  try {
    // Decode JWT to check timestamp (basic implementation)
    const token = tokenHeader.replace('Bearer ', '');
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new AuthenticationError('Invalid token format');
    }
    
    const payload = JSON.parse(atob(parts[1] || ''));
    
    if (!payload) {
      throw new AuthenticationError('Invalid token payload');
    }
    
    if (payload.exp && (payload.exp * 1000 < Date.now())) {
      throw new AuthenticationError('Session expired');
    }
    
    if (payload.iat && ((Date.now() - payload.iat * 1000) > sessionTimeout)) {
      throw new AuthenticationError('Session timeout exceeded');
    }
  } catch (error) {
    if (error instanceof AuthenticationError) {
      throw error;
    }
    throw new AuthenticationError('Invalid token format');
  }
}

/**
 * Wrapper for API routes with automatic error handling
 */
export function withAuth(handler: (request: NextRequest, user: AuthenticatedUser) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    try {
      const user = await requireAuth(request);
      await enforceSessionTimeout(request);
      return await handler(request, user);
    } catch (error) {
      if (error instanceof AuthenticationError || error instanceof AuthorizationError) {
        return NextResponse.json(
          { error: error.message, code: 'AUTH_ERROR' },
          { status: error.status }
        );
      }
      
      console.error('Unexpected auth error:', error);
      return NextResponse.json(
        { error: 'Internal server error', code: 'INTERNAL_ERROR' },
        { status: 500 }
      );
    }
  };
}

/**
 * Admin-only wrapper
 */
export function withAdminAuth(handler: (request: NextRequest, user: AuthenticatedUser) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    try {
      const user = await requireAdmin(request);
      await enforceSessionTimeout(request);
      return await handler(request, user);
    } catch (error) {
      if (error instanceof AuthenticationError || error instanceof AuthorizationError) {
        return NextResponse.json(
          { error: error.message, code: 'AUTH_ERROR' },
          { status: error.status }
        );
      }
      
      console.error('Unexpected admin auth error:', error);
      return NextResponse.json(
        { error: 'Internal server error', code: 'INTERNAL_ERROR' },
        { status: 500 }
      );
    }
  };
}
