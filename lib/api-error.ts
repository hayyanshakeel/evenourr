import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

export interface ApiSuccess<T> { success: true; data: T; requestId: string; }
export interface ApiFailure { success: false; error: { code: string; message: string }; requestId: string; }

export function ok<T>(data: T, init?: ResponseInit) {
  const requestId = randomUUID();
  return withSecurityHeaders(NextResponse.json<ApiSuccess<T>>({ success: true, data, requestId }, { status: 200 }), requestId);
}

export function fail(code: string, message: string, status = 400) {
  const requestId = randomUUID();
  return withSecurityHeaders(NextResponse.json<ApiFailure>({ success: false, error: { code, message }, requestId }, { status }), requestId);
}

const SEC_HEADERS: Record<string,string> = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

function withSecurityHeaders(res: NextResponse, requestId: string) {
  Object.entries(SEC_HEADERS).forEach(([k,v]) => res.headers.set(k,v));
  res.headers.set('X-Request-Id', requestId);
  return res;
}
