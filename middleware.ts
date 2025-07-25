import { NextRequest, NextResponse } from 'next/server';
import { SECURITY_CONFIG } from './lib/security/config';
import { 
  applySecurityHeaders, 
  applyCorsHeaders, 
  rateLimit, 
  isProtectedRoute,
  handleSecurityError 
} from './lib/security/middleware';

// Rate limiters for different types of requests
const globalRateLimit = rateLimit(SECURITY_CONFIG.RATE_LIMITS.GLOBAL);
const authRateLimit = rateLimit(SECURITY_CONFIG.RATE_LIMITS.AUTH);
const apiRateLimit = rateLimit(SECURITY_CONFIG.RATE_LIMITS.API_WRITE);

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const origin = request.headers.get('origin');
    
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      const response = new NextResponse(null, { status: 200 });
      applyCorsHeaders(response, origin || undefined);
      return response;
    }

    // Apply global rate limiting
    if (!globalRateLimit(request)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Apply specific rate limiting for auth endpoints
    if (pathname.startsWith('/api/auth/')) {
      if (!authRateLimit(request)) {
        return NextResponse.json(
          { error: 'Too many authentication attempts. Please try again later.' },
          { status: 429 }
        );
      }
    }

    // Apply API rate limiting for write operations
    if (pathname.startsWith('/api/') && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
      if (!apiRateLimit(request)) {
        return NextResponse.json(
          { error: 'API rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
    }

    // Block access to sensitive files and directories
    const blockedPaths = [
      '/.env',
      '/.env.local',
      '/.env.production',
      '/package.json',
      '/prisma/',
      '/lib/db',
      '/node_modules/',
      '/.git/',
      '/logs/',
    ];
    
    if (blockedPaths.some(blocked => pathname.startsWith(blocked))) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Admin panel protection - let client-side handle authentication
    // The AdminProtectedRoute component will handle Firebase auth checks
    // No need to check auth tokens in middleware for admin routes

    // Create response and apply security headers
    const response = NextResponse.next();
    
    // Apply CORS headers
    applyCorsHeaders(response, origin || undefined);
    
    // Apply security headers
    applySecurityHeaders(response);
    
    // Add custom security headers based on route
    if (pathname.startsWith('/api/')) {
      response.headers.set('X-API-Version', '1.0');
      response.headers.set('X-Rate-Limit-Remaining', '100'); // This should be dynamic
    }
    
    if (pathname.startsWith('/hatsadmin')) {
      response.headers.set('X-Frame-Options', 'DENY');
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    }

    return response;

  } catch (error) {
    console.error('Middleware error:', error);
    return handleSecurityError(error);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|public|images|icons).*)',
  ],
};
