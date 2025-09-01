/**
 * Admin Guard Module
 * Provides authentication middleware for admin API routes
 */

import { NextRequest, NextResponse } from 'next/server';

interface AdminGuardResponse {
  admin?: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
  response?: NextResponse;
}

/**
 * Middleware function to require admin authentication
 * This validates admin tokens and ensures proper authorization
 */
export async function requireAdmin(request: NextRequest): Promise<AdminGuardResponse> {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        response: NextResponse.json(
          { success: false, error: 'Authorization header required' },
          { status: 401 }
        )
      };
    }

    const token = authHeader.substring(7);
    
    // Validate token (simple base64 decode for now - matches Worker implementation)
    try {
      const decoded = JSON.parse(atob(token));
      
      // Check if token has expired
      if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
        return {
          response: NextResponse.json(
            { success: false, error: 'Token expired' },
            { status: 401 }
          )
        };
      }
      
      // Check issuer
      if (decoded.iss !== 'evenour-admin') {
        return {
          response: NextResponse.json(
            { success: false, error: 'Invalid token issuer' },
            { status: 401 }
          )
        };
      }
      
      // Return admin user info
      return {
        admin: {
          id: decoded.sub || decoded.id,
          username: decoded.username,
          email: decoded.email,
          role: decoded.role
        }
      };
      
    } catch (decodeError) {
      console.error('Token decode error:', decodeError);
      return {
        response: NextResponse.json(
          { success: false, error: 'Invalid token format' },
          { status: 401 }
        )
      };
    }
    
  } catch (error) {
    console.error('Admin guard error:', error);
    return {
      response: NextResponse.json(
        { success: false, error: 'Authentication failed' },
        { status: 500 }
      )
    };
  }
}

/**
 * Middleware to check if user has specific admin role
 */
export async function requireAdminRole(request: NextRequest, requiredRole?: string): Promise<AdminGuardResponse> {
  const guardResult = await requireAdmin(request);
  
  if (guardResult.response) {
    return guardResult;
  }
  
  if (requiredRole && guardResult.admin?.role !== requiredRole && guardResult.admin?.role !== 'super_admin') {
    return {
      response: NextResponse.json(
        { success: false, error: `Required role: ${requiredRole}` },
        { status: 403 }
      )
    };
  }
  
  return guardResult;
}

/**
 * Check if current user is super admin
 */
export async function requireSuperAdmin(request: NextRequest): Promise<AdminGuardResponse> {
  return requireAdminRole(request, 'super_admin');
}
