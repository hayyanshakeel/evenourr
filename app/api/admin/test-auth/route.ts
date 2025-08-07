import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Test Auth: Request received');
    
    // Check for authorization header
    const authHeader = request.headers.get('authorization');
    console.log('🔍 Test Auth: Auth header:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader) {
      return NextResponse.json({ 
        error: 'No authorization header', 
        headers: Object.fromEntries(request.headers.entries())
      }, { status: 401 });
    }
    
    console.log('🔍 Test Auth: Auth header value:', authHeader.substring(0, 30) + '...');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Authentication header received',
      authHeaderPresent: !!authHeader,
      authHeaderPreview: authHeader.substring(0, 30) + '...'
    });
    
  } catch (error) {
    console.error('Test auth error:', error);
    return NextResponse.json({ error: 'Test failed' }, { status: 500 });
  }
}
