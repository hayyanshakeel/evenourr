/**
 * 3-Layered Admin API Gateway - Cloudflare Worker
 * Layer 3: Business Logic & Database Operations
 * Handles ALL admin API requests: auth, orders, products, customers, etc.
 */

import { CloudflareEnv, SessionData, JWTPayload } from './types';

export interface CloudflareRequest extends Request {
  cf?: {
    country?: string;
    colo?: string;
    httpProtocol?: string;
  };
}

export default {
  async fetch(request: CloudflareRequest, env: CloudflareEnv): Promise<Response> {
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
      // Handle auth endpoints directly 
      if (url.pathname.startsWith('/auth/')) {
        return await handleAuth(request, env, corsHeaders);
      }
      
      // Handle all admin API routes (orders, products, customers, etc.)
      if (url.pathname.startsWith('/api/admin/')) {
        return await handleAdminAPI(request, env, corsHeaders);
      }
      
      // Legacy support for hatsadmin routes
      if (url.pathname.startsWith('/hatsadmin/')) {
        return await handleAdminAPI(request, env, corsHeaders);
      }
      
      // Health check
      if (url.pathname === '/health') {
        return jsonResponse({ 
          service: '3-Layer Admin API Gateway', 
          status: 'healthy',
          layer: 'business-logic',
          edge: request.cf?.colo,
          timestamp: new Date().toISOString()
        }, { status: 200, headers: corsHeaders });
      }

      return jsonResponse({ error: 'Endpoint not found' }, { status: 404, headers: corsHeaders });
      
    } catch (error) {
      console.error('Layer 3 Worker error:', error);
      return jsonResponse(
        { error: 'Internal server error' },
        { status: 500, headers: corsHeaders }
      );
    }
  }
};

async function handleAdminAPI(
  request: CloudflareRequest, 
  env: CloudflareEnv, 
  corsHeaders: Record<string, string>
): Promise<Response> {
  const url = new URL(request.url);
  
  // Handle auth endpoints directly (no proxy to Turso needed)
  if (url.pathname.startsWith('/hatsadmin/auth/')) {
    return await handleAuth(request, env, corsHeaders);
  }

  // All other admin endpoints require authentication
  const authResult = await validateRequest(request, env);
  if (!authResult.valid) {
    return jsonResponse(
      { error: 'Unauthorized', code: 'AUTH_REQUIRED' }, 
      { status: 401, headers: corsHeaders }
    );
  }

  // Proxy authenticated request to Turso
  return await proxyToTurso(request, env, corsHeaders, authResult.user);
}

async function handleAuth(
  request: CloudflareRequest, 
  env: CloudflareEnv, 
  corsHeaders: Record<string, string>
): Promise<Response> {
  const url = new URL(request.url);
  const endpoint = url.pathname.replace('/hatsadmin/auth/', '');
  
  switch (endpoint) {
    case 'login':
      return await handleLogin(request, env, corsHeaders);
    case 'validate':
      return await handleValidate(request, env, corsHeaders);
    case 'logout':
      return await handleLogout(request, env, corsHeaders);
    default:
      return jsonResponse({ error: 'Auth endpoint not found' }, { status: 404, headers: corsHeaders });
  }
}

async function handleLogin(
  request: CloudflareRequest,
  env: CloudflareEnv,
  corsHeaders: Record<string, string>
): Promise<Response> {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, { status: 405, headers: corsHeaders });
  }

  try {
    const body = await request.json() as { username: string; password: string };
    const { username, password } = body;

    if (!username || !password) {
      return jsonResponse({ error: 'Username and password required' }, { status: 400, headers: corsHeaders });
    }

    // Simple admin credential check - in production, use proper auth
    const validCredentials = {
      'admin_1': 'admin123',
      'admin_2': 'admin456'
    };

    if (!validCredentials[username as keyof typeof validCredentials] || 
        validCredentials[username as keyof typeof validCredentials] !== password) {
      return jsonResponse({ error: 'Invalid credentials' }, { status: 401, headers: corsHeaders });
    }

    // Create token in the same format as the local API
    const tokenPayload = {
      username,
      email: `${username}@evenour.in`,
      role: 'admin',
      exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour
      iss: 'evenour-admin'
    };

    const token = btoa(JSON.stringify(tokenPayload));

    // Store session in KV for validation
    const sessionData: SessionData = {
      id: crypto.randomUUID(),
      tokenId: token,
      username,
      email: `${username}@evenour.in`,
      role: 'admin',
      loginMethod: 'password',
      createdAt: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000),
      ip: request.headers.get('CF-Connecting-IP') || 'unknown',
      userAgent: request.headers.get('User-Agent') || 'unknown',
      country: request.cf?.country || 'unknown'
    };

    await env.AUTH_TOKENS.put(`session:${token}`, JSON.stringify(sessionData), { expirationTtl: 24 * 60 * 60 });

    return jsonResponse({
      success: true,
      token,
      user: { username, email: tokenPayload.email, role: 'admin' }
    }, { status: 200, headers: corsHeaders });

  } catch (error) {
    console.error('Login error:', error);
    return jsonResponse({ error: 'Authentication failed' }, { status: 500, headers: corsHeaders });
  }
}

async function handleValidate(
  request: CloudflareRequest,
  env: CloudflareEnv,
  corsHeaders: Record<string, string>
): Promise<Response> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return jsonResponse({ error: 'No authorization header' }, { status: 401, headers: corsHeaders });
    }

    const token = authHeader.substring(7);
    
    // Try to decode and validate the token
    try {
      const decoded = JSON.parse(atob(token));
      
      if (!decoded.iss || decoded.iss !== 'evenour-admin') {
        return jsonResponse({ error: 'Invalid token issuer' }, { status: 401, headers: corsHeaders });
      }

      if (!decoded.exp || decoded.exp <= Math.floor(Date.now() / 1000)) {
        return jsonResponse({ error: 'Token expired' }, { status: 401, headers: corsHeaders });
      }

      // Check if session exists in KV
      const sessionStr = await env.AUTH_TOKENS.get(`session:${token}`);
      if (!sessionStr) {
        return jsonResponse({ error: 'Session not found' }, { status: 401, headers: corsHeaders });
      }

      const session = JSON.parse(sessionStr) as SessionData;

      return jsonResponse({
        success: true,
        user: { username: session.username, email: session.email, role: session.role }
      }, { status: 200, headers: corsHeaders });

    } catch (decodeError) {
      return jsonResponse({ error: 'Invalid token format' }, { status: 401, headers: corsHeaders });
    }

  } catch (error) {
    return jsonResponse({ error: 'Validation failed' }, { status: 401, headers: corsHeaders });
  }
}

async function handleLogout(
  request: CloudflareRequest,
  env: CloudflareEnv,
  corsHeaders: Record<string, string>
): Promise<Response> {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      await env.AUTH_TOKENS.delete(`session:${token}`);
    }

    return jsonResponse({ success: true }, { status: 200, headers: corsHeaders });
  } catch (error) {
    return jsonResponse({ success: true }, { status: 200, headers: corsHeaders });
  }
}

async function validateRequest(
  request: CloudflareRequest, 
  env: CloudflareEnv
): Promise<{ valid: boolean; user?: any }> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return { valid: false };
    }

    const token = authHeader.substring(7);
    const decoded = JSON.parse(atob(token));
    
    if (!decoded.iss || decoded.iss !== 'evenour-admin') {
      return { valid: false };
    }

    if (!decoded.exp || decoded.exp <= Math.floor(Date.now() / 1000)) {
      return { valid: false };
    }

    const sessionStr = await env.AUTH_TOKENS.get(`session:${token}`);
    if (!sessionStr) {
      return { valid: false };
    }

    const session = JSON.parse(sessionStr) as SessionData;
    return { 
      valid: true, 
      user: { username: session.username, email: session.email, role: session.role } 
    };

  } catch (error) {
    return { valid: false };
  }
}

async function proxyToTurso(
  request: CloudflareRequest, 
  env: CloudflareEnv, 
  corsHeaders: Record<string, string>,
  user: any
): Promise<Response> {
  // This is where we'd proxy requests to Turso/your backend
  // For now, return a placeholder response
  const url = new URL(request.url);
  const endpoint = url.pathname.replace('/hatsadmin/', '');

  // Mock response for now - in production, this would proxy to your Turso API
  return jsonResponse({
    message: `Proxied request to ${endpoint}`,
    user: user.username,
    status: 'Not implemented - add Turso proxy logic here'
  }, { status: 200, headers: corsHeaders });
}

// Utilities
function jsonResponse(data: any, options: { status: number; headers: Record<string, string> }) {
  return new Response(JSON.stringify(data, null, 2), {
    status: options.status,
    headers: { 'Content-Type': 'application/json', ...options.headers }
  });
}
