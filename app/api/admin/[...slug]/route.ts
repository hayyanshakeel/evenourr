/**
 * Catch-all Admin API Route
 * Redirects all admin API calls to the 3-layer Cloudflare worker system
 * This ensures all admin operations go through the enhanced security architecture
 */

import { NextRequest, NextResponse } from 'next/server';

// The 3-layer system entry point (Layer 1: DDoS Protection)
const CLOUDFLARE_GATEWAY_URL = 'https://evenour-ddos-protection.evenour-in.workers.dev';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  return handleAdminApiRequest(request, params.slug);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  return handleAdminApiRequest(request, params.slug);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  return handleAdminApiRequest(request, params.slug);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  return handleAdminApiRequest(request, params.slug);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  return handleAdminApiRequest(request, params.slug);
}

async function handleAdminApiRequest(
  request: NextRequest,
  slug: string[]
): Promise<NextResponse> {
  try {
    // Construct the path from the slug
    const apiPath = `/api/admin/${slug.join('/')}`;
    
    // Auth endpoints should not be routed through 3-layer system
    // They continue to use the original auth worker
    if (apiPath.includes('/auth/') || apiPath.includes('/login') || apiPath.includes('/logout') || apiPath.includes('/test-auth')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Auth endpoints should use original auth system, not 3-layer routing'
        },
        { status: 400 }
      );
    }
    
    // Get the search params
    const searchParams = request.nextUrl.searchParams.toString();
    const queryString = searchParams ? `?${searchParams}` : '';
    
    // Construct the full Cloudflare worker URL
    const cloudflareUrl = `${CLOUDFLARE_GATEWAY_URL}${apiPath}${queryString}`;
    
    console.log('[Admin API Proxy] Routing to 3-layer system:', {
      originalPath: apiPath,
      cloudflareUrl,
      method: request.method,
      hasAuth: !!request.headers.get('authorization')
    });

    // Forward the request to the 3-layer Cloudflare system
    const forwardedRequest = new Request(cloudflareUrl, {
      method: request.method,
      headers: {
        ...Object.fromEntries(request.headers.entries()),
        'X-Forwarded-Host': request.headers.get('host') || '',
        'X-Original-URL': request.url
      },
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body
    });

    const response = await fetch(forwardedRequest);
    
    // Get response data
    const contentType = response.headers.get('content-type');
    let responseBody;
    
    if (contentType && contentType.includes('application/json')) {
      responseBody = await response.json();
    } else {
      responseBody = await response.text();
    }

    console.log('[Admin API Proxy] Response from 3-layer system:', {
      status: response.status,
      contentType,
      success: response.ok
    });

    // Return the response with proper headers
    const responseHeaders = new Headers();
    
    // Copy important headers from the Cloudflare response
    response.headers.forEach((value, key) => {
      if (!key.startsWith('cf-') && key !== 'set-cookie') {
        responseHeaders.set(key, value);
      }
    });

    // Add CORS headers for the admin panel
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Token');

    return new NextResponse(
      contentType && contentType.includes('application/json') 
        ? JSON.stringify(responseBody)
        : responseBody,
      {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders
      }
    );

  } catch (error) {
    console.error('[Admin API Proxy] Error routing to 3-layer system:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to route request through 3-layer security system',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Token',
      'Access-Control-Max-Age': '86400'
    }
  });
}
