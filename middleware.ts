import { NextRequest, NextResponse } from 'next/server';

// Minimal edge-safe middleware: only CORS preflight + baseline security headers.
// All auth, rate limiting, and advanced security now moved to API route-level server code.

const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

function applyHeaders(res: NextResponse) {
  Object.entries(SECURITY_HEADERS).forEach(([k, v]) => res.headers.set(k, v));
  return res;
}

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin');

  // Handle CORS preflight quickly
  if (request.method === 'OPTIONS') {
    const pre = new NextResponse(null, { status: 204 });
    if (origin) pre.headers.set('Access-Control-Allow-Origin', origin);
    pre.headers.set('Vary', 'Origin');
    pre.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    pre.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-API-Key, X-CSRF-Token');
    pre.headers.set('Access-Control-Max-Age', '86400');
    return applyHeaders(pre);
  }

  const res = NextResponse.next();
  if (origin) res.headers.set('Access-Control-Allow-Origin', origin);
  res.headers.set('Vary', 'Origin');
  return applyHeaders(res);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|images|icons).*)',
  ],
};
