/**
 * Cloudflare Workers Authentication Service
 * Pure Cloudflare stack with KV, Zero Trust, and Workers
 */

import { CloudflareEnv, SessionData, SecurityEvent, JWTPayload } from './types';

export interface CloudflareRequest extends Request {
  cf?: {
    country?: string;
    city?: string;
    postalCode?: string;
    longitude?: string;
    latitude?: string;
    timezone?: string;
    regionCode?: string;
    asn?: number;
    colo?: string;
    httpProtocol?: string;
    requestPriority?: string;
    tlsVersion?: string;
    tlsCipher?: string;
    tlsClientAuth?: {
      certIssuerDNLegacy?: string;
      certVerified?: string;
      certNotBefore?: string;
      certNotAfter?: string;
      certSubjectDNLegacy?: string;
      certFingerprintSHA1?: string;
      certFingerprintSHA256?: string;
    };
  };
}

/**
 * Main Cloudflare Workers Handler
 */
export default {
  async fetch(request: CloudflareRequest, env: CloudflareEnv, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { 
        status: 200, 
        headers: corsHeaders 
      });
    }

    try {
      if (url.pathname.startsWith('/auth/')) {
        return await handleAuthRequest(request, env, corsHeaders);
      } else if (url.pathname.startsWith('/api/admin/')) {
        return await handleAdminRequest(request, env, corsHeaders);
      } else if (url.pathname.startsWith('/security/')) {
        return await handleSecurityRequest(request, env, corsHeaders);
      } else {
        return await handleHealthCheck(request, env, corsHeaders);
      }
    } catch (error) {
      console.error('Worker error:', error);
      return jsonResponse(
        { error: 'Internal server error', edge: true },
        { status: 500, headers: corsHeaders }
      );
    }
  }
};

/**
 * Handle authentication requests
 */
async function handleAuthRequest(
  request: CloudflareRequest, 
  env: CloudflareEnv, 
  corsHeaders: Record<string, string>
): Promise<Response> {
  const url = new URL(request.url);
  
  switch (url.pathname) {
    case '/auth/login':
      return await handleLogin(request, env, corsHeaders);
    case '/auth/validate':
      return await handleTokenValidation(request, env, corsHeaders);
    case '/auth/logout':
      return await handleLogout(request, env, corsHeaders);
    default:
      return jsonResponse(
        { error: 'Not found' },
        { status: 404, headers: corsHeaders }
      );
  }
}

/**
 * Handle admin login with Cloudflare Zero Trust integration
 */
async function handleLogin(
  request: CloudflareRequest,
  env: CloudflareEnv,
  corsHeaders: Record<string, string>
): Promise<Response> {
  if (request.method !== 'POST') {
    return jsonResponse(
      { error: 'Method not allowed' },
      { status: 405, headers: corsHeaders }
    );
  }

  try {
    const body = await request.json() as { username: string; password: string };
    const { username, password } = body;

    if (!username || !password) {
      return jsonResponse(
        { error: 'Username and password required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Check Cloudflare Access JWT (Zero Trust)
    const accessJWT = request.headers.get('Cf-Access-Jwt-Assertion');
    let zeroTrustData = null;
    
    if (accessJWT) {
      zeroTrustData = await verifyCloudflareAccessJWT(accessJWT, env);
    }

    // Validate credentials against environment variables
    const validUsername = env.ADMIN_USERNAME || 'admin';
    const validPassword = env.ADMIN_PASSWORD || 'Admin@123!Secure';

    if (username !== validUsername) {
      await logSecurityEvent(env, {
        type: 'auth_failed',
        reason: 'invalid_username',
        ip: request.headers.get('CF-Connecting-IP') || 'unknown',
        country: request.cf?.country || 'unknown',
        userAgent: request.headers.get('User-Agent') || 'unknown'
      });

      return jsonResponse(
        { error: 'Invalid credentials' },
        { status: 401, headers: corsHeaders }
      );
    }

    // Simple password verification (in production, use bcrypt)
    if (password !== validPassword) {
      await logSecurityEvent(env, {
        type: 'auth_failed',
        reason: 'invalid_password',
        ip: request.headers.get('CF-Connecting-IP') || 'unknown',
        country: request.cf?.country || 'unknown',
        userAgent: request.headers.get('User-Agent') || 'unknown'
      });

      return jsonResponse(
        { error: 'Invalid credentials' },
        { status: 401, headers: corsHeaders }
      );
    }

    // Generate secure session
    const sessionId = crypto.randomUUID();
    const tokenId = crypto.randomUUID();
    
    // Create JWT token
    const payload = {
      sub: sessionId,
      username,
      email: env.ADMIN_EMAIL || 'evenour.in@gmail.com',
      role: 'admin',
      loginMethod: 'password',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (8 * 60 * 60), // 8 hours
      aud: 'admin-panel',
      iss: 'evenour-cloudflare-auth',
      jti: tokenId
    };

    const token = await createJWT(payload, env.JWT_SECRET);

    // Store session in KV
    const sessionData = {
      id: sessionId,
      tokenId,
      username,
      email: env.ADMIN_EMAIL || 'evenour.in@gmail.com',
      role: 'admin',
      loginMethod: 'password',
      createdAt: Date.now(),
      expiresAt: Date.now() + (8 * 60 * 60 * 1000),
      ip: request.headers.get('CF-Connecting-IP') || 'unknown',
      userAgent: request.headers.get('User-Agent') || 'unknown',
      country: request.cf?.country || 'unknown',
      zeroTrustData
    };

    // Store with 8-hour TTL
    await env.AUTH_TOKENS.put(`token:${tokenId}`, JSON.stringify(sessionData), {
      expirationTtl: 8 * 60 * 60
    });

    await env.USER_SESSIONS.put(`session:${sessionId}`, JSON.stringify(sessionData), {
      expirationTtl: 8 * 60 * 60
    });

    // Log successful authentication
    await logSecurityEvent(env, {
      type: 'auth_success',
      username,
      sessionId,
      ip: request.headers.get('CF-Connecting-IP') || 'unknown',
      country: request.cf?.country || 'unknown',
      userAgent: request.headers.get('User-Agent') || 'unknown'
    });

    return jsonResponse({
      success: true,
      message: 'Authentication successful',
      token,
      user: {
        username,
        email: env.ADMIN_EMAIL || 'evenour.in@gmail.com',
        role: 'admin'
      },
      expiresAt: new Date(sessionData.expiresAt).toISOString()
    }, { status: 200, headers: corsHeaders });

  } catch (error) {
    console.error('Login error:', error);
    return jsonResponse(
      { error: 'Authentication failed' },
      { status: 500, headers: corsHeaders }
    );
  }
}

/**
 * Handle token validation
 */
async function handleTokenValidation(
  request: CloudflareRequest,
  env: CloudflareEnv,
  corsHeaders: Record<string, string>
): Promise<Response> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return jsonResponse(
        { error: 'No authorization header' },
        { status: 401, headers: corsHeaders }
      );
    }

    const token = authHeader.substring(7);
    const payload = await verifyJWT(token, env.JWT_SECRET);

    if (!payload.jti) {
      return jsonResponse(
        { error: 'Invalid token format' },
        { status: 401, headers: corsHeaders }
      );
    }

    // Check if token exists in KV
    const sessionDataStr = await env.AUTH_TOKENS.get(`token:${payload.jti}`);
    if (!sessionDataStr) {
      return jsonResponse(
        { error: 'Token not found or expired' },
        { status: 401, headers: corsHeaders }
      );
    }

    const sessionData = JSON.parse(sessionDataStr) as any;

    return jsonResponse({
      valid: true,
      user: {
        username: sessionData.username,
        email: sessionData.email,
        role: sessionData.role
      },
      session: {
        id: sessionData.id,
        loginMethod: sessionData.loginMethod,
        expiresAt: new Date(sessionData.expiresAt).toISOString()
      }
    }, { status: 200, headers: corsHeaders });

  } catch (error) {
    console.error('Token validation error:', error);
    return jsonResponse(
      { error: 'Invalid token' },
      { status: 401, headers: corsHeaders }
    );
  }
}

/**
 * Handle logout
 */
async function handleLogout(
  request: CloudflareRequest,
  env: CloudflareEnv,
  corsHeaders: Record<string, string>
): Promise<Response> {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const payload = await verifyJWT(token, env.JWT_SECRET);
      
      if (payload.jti) {
        // Remove token from KV
        await env.AUTH_TOKENS.delete(`token:${payload.jti}`);
        await env.USER_SESSIONS.delete(`session:${payload.sub}`);
        
        await logSecurityEvent(env, {
          type: 'logout',
          username: payload.username,
          sessionId: payload.sub,
          ip: request.headers.get('CF-Connecting-IP') || 'unknown'
        });
      }
    }

    return jsonResponse({
      success: true,
      message: 'Logged out successfully'
    }, { status: 200, headers: corsHeaders });

  } catch (error) {
    // Even if logout fails, return success to prevent client issues
    return jsonResponse({
      success: true,
      message: 'Logged out successfully'
    }, { status: 200, headers: corsHeaders });
  }
}

/**
 * Handle health check
 */
async function handleHealthCheck(
  request: CloudflareRequest,
  env: CloudflareEnv,
  corsHeaders: Record<string, string>
): Promise<Response> {
  return jsonResponse({
    service: 'Evenour Edge Auth',
    status: 'healthy',
    edge: {
      colo: request.cf?.colo,
      country: request.cf?.country,
      httpProtocol: request.cf?.httpProtocol
    },
    timestamp: new Date().toISOString()
  }, { status: 200, headers: corsHeaders });
}

// Helper functions
function jsonResponse(data: any, options: { status: number; headers: Record<string, string> }) {
  return new Response(JSON.stringify(data), {
    status: options.status,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
}

async function createJWT(payload: any, secret: string): Promise<string> {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const headerBase64 = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const payloadBase64 = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  
  const data = encoder.encode(`${headerBase64}.${payloadBase64}`);
  const signature = await crypto.subtle.sign('HMAC', key, data);
  const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  return `${headerBase64}.${payloadBase64}.${signatureBase64}`;
}

async function verifyJWT(token: string, secret: string): Promise<any> {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid token format');
  }

  const [headerBase64, payloadBase64, signatureBase64] = parts;

  if (!headerBase64 || !payloadBase64 || !signatureBase64) {
    throw new Error('Invalid token format');
  }

  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );

  const data = encoder.encode(`${headerBase64}.${payloadBase64}`);
  const signature = Uint8Array.from(atob(signatureBase64.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));

  const isValid = await crypto.subtle.verify('HMAC', key, signature, data);
  if (!isValid) {
    throw new Error('Invalid signature');
  }

  const payload = JSON.parse(atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/')));

  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('Token expired');
  }

  return payload;
}

async function logSecurityEvent(env: CloudflareEnv, event: any): Promise<void> {
  const eventId = crypto.randomUUID();
  const eventData = {
    id: eventId,
    timestamp: new Date().toISOString(),
    ...event
  };

  // Store in KV with 24-hour TTL
  await env.SECURITY_EVENTS.put(`event:${eventId}`, JSON.stringify(eventData), {
    expirationTtl: 24 * 60 * 60
  });
}

async function verifyCloudflareAccessJWT(jwt: string, env: CloudflareEnv): Promise<any> {
  // In production, verify with Cloudflare's public keys
  // For now, return decoded payload
  try {
    const parts = jwt.split('.');
    if (parts.length < 2) {
      return null;
    }

    const payloadBase64 = parts[1];
    if (!payloadBase64) {
      return null;
    }

    const payload = JSON.parse(atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/')));
    return payload;
  } catch (error) {
    return null;
  }
}

async function handleAdminRequest(
  request: CloudflareRequest,
  env: CloudflareEnv,
  corsHeaders: Record<string, string>
): Promise<Response> {
  // Proxy admin requests to Next.js origin after authentication
  return jsonResponse(
    { message: 'Admin request handled at edge', timestamp: new Date().toISOString() },
    { status: 200, headers: corsHeaders }
  );
}

async function handleSecurityRequest(
  request: CloudflareRequest,
  env: CloudflareEnv,
  corsHeaders: Record<string, string>
): Promise<Response> {
  return jsonResponse(
    { message: 'Security request handled', timestamp: new Date().toISOString() },
    { status: 200, headers: corsHeaders }
  );
}

async function handleOriginRequest(
  request: CloudflareRequest,
  env: CloudflareEnv,
  corsHeaders: Record<string, string>
): Promise<Response> {
  // Proxy to Next.js origin
  return jsonResponse(
    { message: 'Proxied to origin', edge: true, location: request.cf?.colo },
    { status: 200, headers: corsHeaders }
  );
}
