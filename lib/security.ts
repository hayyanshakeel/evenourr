import { NextRequest, NextResponse } from 'next/server';

// Security headers configuration
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': process.env.NODE_ENV === 'production' 
    ? "default-src 'self'; script-src 'self' 'unsafe-eval' https://cdnjs.cloudflare.com https://apis.google.com https://www.gstatic.com https://securetoken.googleapis.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://res.cloudinary.com; font-src 'self' data:; connect-src 'self' https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://apis.google.com;"
    : "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdnjs.cloudflare.com https://apis.google.com https://www.gstatic.com https://securetoken.googleapis.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://res.cloudinary.com; font-src 'self' data:; connect-src 'self' https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://apis.google.com;",
};

// Rate limiting storage
const requestCounts = new Map<string, { count: number; resetTime: number }>();

// Rate limiting function
export function rateLimit(request: NextRequest, maxRequests = 100, windowMs = 15 * 60 * 1000) {
  // Get client IP from headers or use fallback
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
             request.headers.get('x-real-ip') || 
             'unknown';
  const now = Date.now();
  const key = ip;

  const current = requestCounts.get(key);
  
  if (!current || now > current.resetTime) {
    requestCounts.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (current.count >= maxRequests) {
    return false;
  }

  current.count++;
  return true;
}

// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Validation helpers
export function validatePagination(limit?: string, offset?: string) {
  const parsedLimit = Math.max(1, Math.min(100, parseInt(limit || '20')));
  const parsedOffset = Math.max(0, parseInt(offset || '0'));
  return { limit: parsedLimit, offset: parsedOffset };
}

// Secure response wrapper
export function secureResponse(data: any) {
  return NextResponse.json(data, {
    headers: securityHeaders,
  });
}

// Error response wrapper
export function errorResponse(message: string, status = 500) {
  return NextResponse.json(
    { error: message },
    { 
      status,
      headers: securityHeaders,
    }
  );
}
