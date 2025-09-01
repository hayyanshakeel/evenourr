import { NextRequest, NextResponse } from 'next/server';
import { EnterpriseAuthService } from '@/lib/enterprise-auth';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { 
          active: false,
          error: 'Missing or invalid authorization header'
        },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify the access token
    const verification = await EnterpriseAuthService.verifyAccessToken(token);

    if (!verification.valid || !verification.payload) {
      return NextResponse.json({
        active: false,
        error: verification.error || 'Invalid token'
      });
    }

    const payload = verification.payload;

    // Return RFC 7662 compliant token introspection response
    return NextResponse.json({
      active: true,
      scope: payload.scope,
      client_id: 'jsevenour-enterprise',
      username: payload.sub,
      token_type: 'Bearer',
      exp: payload.exp,
      iat: payload.iat,
      nbf: payload.nbf,
      sub: payload.sub,
      aud: payload.aud,
      iss: payload.iss,
      device_id: payload.device_id,
      session_id: payload.session_id,
      cnf: payload.cnf
    });

  } catch (error) {
    console.error('Token introspection error:', error);
    return NextResponse.json(
      { 
        active: false,
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
