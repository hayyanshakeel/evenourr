import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    // Get all headers for debugging
    const headers = Object.fromEntries(request.headers.entries());
    
    return NextResponse.json({
      message: 'Debug endpoint - check auth headers',
      hasAuth: !!headers.authorization,
      authHeader: headers.authorization ? headers.authorization.substring(0, 20) + '...' : null,
      url: request.url,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ error: 'Debug endpoint error', details: String(error) }, { status: 500 });
  }
}
