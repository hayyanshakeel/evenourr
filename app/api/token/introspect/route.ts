import { NextRequest, NextResponse } from 'next/server';
import { EnterpriseAuthService } from '@/lib/enterprise-auth';
import { z } from 'zod';

const introspectSchema = z.object({
  token: z.string(),
});

/**
 * Token Introspection Endpoint (RFC 7662)
 * 
 * Determines the active state and meta-information of a token.
 * Used by resource servers to validate access tokens.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = introspectSchema.parse(body);

    // Verify the token
    const verification = await EnterpriseAuthService.verifyAccessToken(token);
    
    if (!verification.valid || !verification.payload) {
      return NextResponse.json({
        active: false,
      });
    }

    const { payload } = verification;
    
    // Get device information if available
    let deviceInfo = null;
    if (payload.device_id) {
      try {
        // Since we don't have a getDevice method yet, we'll skip device lookup for now
        // This would be implemented based on the actual device storage method
      } catch (error) {
        console.warn('Failed to get device info:', error);
      }
    }

    // Return token information according to RFC 7662
    return NextResponse.json({
      active: true,
      scope: payload.scope || 'admin',
      client_id: payload.aud,
      username: payload.sub,
      token_type: 'Bearer',
      exp: payload.exp,
      iat: payload.iat,
      nbf: payload.nbf,
      sub: payload.sub,
      aud: payload.aud,
      iss: payload.iss,
      // Custom claims
      device_id: payload.device_id,
      session_id: payload.session_id,
      // Token binding information
      cnf: payload.cnf,
    });

  } catch (error) {
    console.error('Token introspection error:', error);
    
    // For malformed tokens, return inactive
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        active: false,
        error: 'invalid_request',
        error_description: 'Invalid request format'
      }, { status: 400 });
    }

    return NextResponse.json({
      active: false,
      error: 'server_error',
      error_description: 'Internal server error'
    }, { status: 500 });
  }
}
