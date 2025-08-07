import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const headers = Object.fromEntries(request.headers.entries());
  
  console.log('=== DEBUG HEADERS ===');
  console.log('All headers:', headers);
  console.log('Authorization header:', request.headers.get('authorization') || request.headers.get('Authorization'));
  console.log('=====================');
  
  return NextResponse.json({
    headers: headers,
    authorization: request.headers.get('authorization') || request.headers.get('Authorization'),
    hasAuth: !!(request.headers.get('authorization') || request.headers.get('Authorization')),
  });
}
