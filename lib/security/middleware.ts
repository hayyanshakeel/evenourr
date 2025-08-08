import { NextRequest, NextResponse } from 'next/server';
import { SECURITY_CONFIG } from './config';
import { ValidationError } from './validation';

// Rate limiting storage (in production, use Redis or external service)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Authentication token validation (placeholder - always invalid without real verification)
export async function validateAuthToken(_request: NextRequest): Promise<{ valid: boolean; userId?: string; role?: string }> {
  // Intentionally disabled insecure base64 decode implementation.
  return { valid: false };
}

// Rate limiting middleware
export function rateLimit(requestsPerMinute: number) {
  return (request: NextRequest): boolean => {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const key = `rate_limit_${ip}`;
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    
    const record = rateLimitStore.get(key);
    
    if (!record || now > record.resetTime) {
      rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }
    
    if (record.count >= requestsPerMinute) {
      return false;
    }
    
    record.count++;
    return true;
  };
}

// CORS middleware
export function applyCorsHeaders(response: NextResponse, origin?: string): NextResponse {
  const allowedOrigins = SECURITY_CONFIG.CORS.ALLOWED_ORIGINS;
  
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  } else if (allowedOrigins.includes('*')) {
    response.headers.set('Access-Control-Allow-Origin', '*');
  }
  
  response.headers.set('Access-Control-Allow-Methods', SECURITY_CONFIG.CORS.ALLOWED_METHODS.join(', '));
  response.headers.set('Access-Control-Allow-Headers', SECURITY_CONFIG.CORS.ALLOWED_HEADERS.join(', '));
  response.headers.set('Access-Control-Max-Age', '86400');
  
  return response;
}

// Security headers middleware
export function applySecurityHeaders(response: NextResponse): NextResponse {
  Object.entries(SECURITY_CONFIG.SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  return response;
}

// Admin route protection
export function requireAdmin(userRole?: string): boolean {
  return userRole === 'admin' || userRole === 'moderator';
}

// Route protection checker
export function isProtectedRoute(pathname: string): boolean {
  return SECURITY_CONFIG.ADMIN_ROUTES.some(route => 
    pathname.startsWith(route)
  ) && !SECURITY_CONFIG.PUBLIC_ROUTES.some(route => 
    pathname.startsWith(route)
  );
}

// Input sanitization middleware
export function sanitizeRequestBody(body: any): any {
  if (typeof body !== 'object' || body === null) {
    return body;
  }
  
  if (Array.isArray(body)) {
    return body.map(sanitizeRequestBody);
  }
  
  const sanitized: any = {};
  
  for (const [key, value] of Object.entries(body)) {
    if (typeof value === 'string') {
      sanitized[key] = value.trim().replace(/[\x00-\x1F\x7F]/g, '');
    } else if (typeof value === 'object') {
      sanitized[key] = sanitizeRequestBody(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

// Error handler for security middleware
export function handleSecurityError(error: unknown): NextResponse {
  console.error('Security middleware error:', error);
  
  if (error instanceof ValidationError) {
    return NextResponse.json(
      { 
        error: 'Validation failed', 
        details: error.errors 
      },
      { status: 400 }
    );
  }
  
  return NextResponse.json(
    { error: 'Security error occurred' },
    { status: 500 }
  );
}

// Main security middleware factory
export function createSecurityMiddleware(options: {
  requireAuth?: boolean;
  requireAdmin?: boolean;
  rateLimit?: number;
  validateInput?: boolean;
}) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    try {
      const origin = request.headers.get('origin');
      
      // Handle preflight requests
      if (request.method === 'OPTIONS') {
        const response = new NextResponse(null, { status: 200 });
        applyCorsHeaders(response, origin || undefined);
        return response;
      }
      
      // Apply rate limiting
      if (options.rateLimit) {
        const rateLimiter = rateLimit(options.rateLimit);
        if (!rateLimiter(request)) {
          return NextResponse.json(
            { error: 'Rate limit exceeded' },
            { status: 429 }
          );
        }
      }
      
      // Validate authentication if required
      if (options.requireAuth || options.requireAdmin) {
        const authResult = await validateAuthToken(request);
        
        if (!authResult.valid) {
          return NextResponse.json(
            { error: 'Authentication required' },
            { status: 401 }
          );
        }
        
        if (options.requireAdmin && !requireAdmin(authResult.role)) {
          return NextResponse.json(
            { error: 'Admin access required' },
            { status: 403 }
          );
        }
        
        // Add user info to request headers for API routes
        const response = NextResponse.next();
        response.headers.set('x-user-id', authResult.userId || '');
        response.headers.set('x-user-role', authResult.role || '');
      }
      
      return null; // Continue to next middleware/handler
    } catch (error) {
      return handleSecurityError(error);
    }
  };
}

// Utility to extract user info from request headers (for API routes)
export function getUserFromRequest(request: NextRequest): { userId?: string; role?: string } {
  return {
    userId: request.headers.get('x-user-id') || undefined,
    role: request.headers.get('x-user-role') || undefined,
  };
}
