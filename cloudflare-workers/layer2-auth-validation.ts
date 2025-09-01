/**
 * Layer 2: Authentication & Authorization Worker
 * Validates admin tokens and permissions before passing to Layer 3
 */

interface Env {
  AUTH_TOKENS: KVNamespace;
  ADMIN_SESSIONS: KVNamespace;
  LAYER3_WORKER_URL: string;
  ADMIN_USERNAME: string;
  ADMIN_PASSWORD: string;
}

interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Token',
      'Access-Control-Max-Age': '86400'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
      // Test endpoint for debugging JWT parsing
      if (url.pathname === '/test-jwt') {
        const authHeader = request.headers.get('Authorization');
        const result = await validateToken(request, env);
        return new Response(JSON.stringify({ 
          hasAuthHeader: !!authHeader,
          authHeader: authHeader ? 'Bearer ***' : null,
          validationResult: result,
          debug: 'JWT parsing test'
        }), { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Handle authentication endpoints directly
      if (url.pathname.startsWith('/auth/')) {
        return await handleAuth(request, env, corsHeaders);
      }

      // All other endpoints require authentication
      const authResult = await validateToken(request, env);
      if (!authResult.valid) {
        console.log(`[Layer 2] Authentication failed for: ${url.pathname}`);
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Authentication required',
          layer: 'auth-validation'
        }), { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Forward authenticated request to Layer 3 (Business Logic)
      const layer3Url = env.LAYER3_WORKER_URL || 'https://evenour-business-logic.evenour-in.workers.dev';
      
      const forwardedRequest = new Request(`${layer3Url}${url.pathname}${url.search}`, {
        method: request.method,
        headers: {
          ...Object.fromEntries(request.headers.entries()),
          'X-Authenticated-User': JSON.stringify(authResult.user),
          'X-Layer': '2-passed'
        },
        body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined
      });

      console.log(`[Layer 2] Forwarding authenticated request to Layer 3: ${url.pathname}`);
      const response = await fetch(forwardedRequest);
      
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: { 
          ...Object.fromEntries(response.headers.entries()), 
          ...corsHeaders,
          'X-Layer-2': 'auth-validated'
        }
      });

    } catch (error) {
      console.error('[Layer 2] Error:', error);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};

async function handleAuth(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  const url = new URL(request.url);
  const endpoint = url.pathname.replace('/auth/', '');
  
  switch (endpoint) {
    case 'login':
      return await handleLogin(request, env, corsHeaders);
    case 'validate':
      return await handleValidate(request, env, corsHeaders);
    case 'logout':
      return await handleLogout(request, env, corsHeaders);
    default:
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Auth endpoint not found' 
      }), { 
        status: 404, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
  }
}

async function handleLogin(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  try {
    const body = await request.json() as { username: string; password: string };
    
    // Validate credentials
    if (body.username === (env.ADMIN_USERNAME || 'admin') && 
        body.password === (env.ADMIN_PASSWORD || 'Admin@123!Secure')) {
      
      // Generate session token
      const sessionId = crypto.randomUUID();
      const token = await generateJWT({
        sub: 'admin',
        username: body.username,
        role: 'admin',
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
      });

      const user: AuthUser = {
        id: 'admin',
        username: body.username,
        email: 'admin@evenour.co',
        role: 'admin'
      };

      // Store session
      await env.ADMIN_SESSIONS.put(sessionId, JSON.stringify({
        user,
        token,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }), { expirationTtl: 24 * 60 * 60 });

      // Store token mapping
      await env.AUTH_TOKENS.put(token, sessionId, { expirationTtl: 24 * 60 * 60 });

      console.log(`[Layer 2] Admin login successful: ${body.username}`);
      
      return new Response(JSON.stringify({
        success: true,
        token,
        sessionId,
        user
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`[Layer 2] Invalid login attempt: ${body.username}`);
    return new Response(JSON.stringify({
      success: false,
      error: 'Invalid credentials'
    }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[Layer 2] Login error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Login failed'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function handleValidate(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  try {
    const authResult = await validateToken(request, env);
    
    return new Response(JSON.stringify({
      success: true,
      valid: authResult.valid,
      user: authResult.user
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('[Layer 2] Validate error:', error);
    return new Response(JSON.stringify({
      success: false,
      valid: false,
      error: 'Validation failed'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function handleLogout(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  try {
    const authHeader = request.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const sessionId = await env.AUTH_TOKENS.get(token);
      
      if (sessionId) {
        await env.AUTH_TOKENS.delete(token);
        await env.ADMIN_SESSIONS.delete(sessionId);
        console.log(`[Layer 2] Admin logout successful`);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Logged out successfully'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('[Layer 2] Logout error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Logout failed'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function validateToken(request: Request, env: Env): Promise<{ valid: boolean; user?: AuthUser }> {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.log('[Layer 2] No Bearer token found');
      return { valid: false };
    }

    const token = authHeader.substring(7);
    console.log('[Layer 2] Token received, length:', token.length);
    
    // The original auth worker uses simple base64 encoding, not JWT format
    // Token is just btoa(JSON.stringify(payload))
    try {
      const payloadJson = atob(token);
      console.log('[Layer 2] Decoded JSON:', payloadJson);
      const parsedPayload = JSON.parse(payloadJson);
      console.log('[Layer 2] Parsed payload:', parsedPayload);
      
      // Check if token is expired
      if (parsedPayload.exp && parsedPayload.exp < Date.now() / 1000) {
        console.log('[Layer 2] Token expired, exp:', parsedPayload.exp, 'now:', Date.now() / 1000);
        return { valid: false };
      }

      // Validate token issuer
      if (parsedPayload.iss !== 'evenour-admin') {
        console.log('[Layer 2] Invalid token issuer:', parsedPayload.iss);
        return { valid: false };
      }

      // Extract user info from token payload
      const user: AuthUser = {
        id: parsedPayload.sub || 'admin',
        username: parsedPayload.username || 'admin',
        email: parsedPayload.email || 'admin@evenour.co',
        role: parsedPayload.role || 'admin'
      };

      console.log('[Layer 2] Token validation successful for user:', user.username);
      return { valid: true, user };

    } catch (decodeError) {
      console.error('[Layer 2] Base64 decode error:', decodeError);
      return { valid: false };
    }

  } catch (error) {
    console.error('[Layer 2] Token validation error:', error);
    return { valid: false };
  }
}

async function generateJWT(payload: any): Promise<string> {
  // Simple JWT-like token for demo (in production, use proper JWT library)
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`));
  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)));
  
  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}
