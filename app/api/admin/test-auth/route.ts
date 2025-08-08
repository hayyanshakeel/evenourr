import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Test Auth: Request received');
    const entries = Object.fromEntries(request.headers.entries());
    console.log('🔍 Headers keys:', Object.keys(entries));

    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
    console.log('🔍 Test Auth: Auth header:', authHeader ? authHeader.substring(0,40)+'...' : 'Missing');

    if (!authHeader) {
      return NextResponse.json({ 
        error: 'No authorization header', 
        headers: entries
      }, { status: 401 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Authentication header received',
      authHeaderPresent: !!authHeader,
      authHeaderPreview: authHeader.substring(0, 40) + '...',
      headers: entries
    });
  } catch (error) {
    console.error('Test auth error:', error);
    return NextResponse.json({ error: 'Test failed' }, { status: 500 });
  }
}
