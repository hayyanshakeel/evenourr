/**
 * Layer 2: DDoS Protection & Rate Limiting Worker
 * Second layer of defense - handles traffic filtering after original auth
 */

interface Env {
  RATE_LIMITER?: KVNamespace;
  LAYER2_WORKER_URL?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
    const userAgent = request.headers.get('User-Agent') || '';
    
    // CORS headers
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
      // 2. Basic bot detection
      if (await isBot(userAgent, clientIP)) {
        console.log(`[Layer 2 - DDoS] Blocked bot: ${clientIP} - ${userAgent}`);
        return new Response('Blocked', { status: 403, headers: corsHeaders });
      }

      // 2. Simple rate limiting (without KV for now)
      // TODO: Re-enable KV-based rate limiting when namespace is properly configured
      // const rateLimitKey = `rate_limit:${clientIP}`;
      // const currentCount = parseInt(await env.RATE_LIMITER.get(rateLimitKey) || '0');
      
      // if (currentCount >= 100) {
      //   console.log(`[Layer 2 - DDoS] Rate limited: ${clientIP} - ${currentCount} requests`);
      //   return new Response('Rate limited', { status: 429, headers: corsHeaders });
      // }
      // await env.RATE_LIMITER.put(rateLimitKey, String(currentCount + 1), { expirationTtl: 60 });

      // 3. DDoS protection - check for suspicious patterns
      if (await isDDoSAttack(request, clientIP, env)) {
        console.log(`[Layer 2 - DDoS] DDoS detected from: ${clientIP}`);
        return new Response('Blocked', { status: 403, headers: corsHeaders });
      }

      // 4. Forward to next layer based on path
      let nextLayerUrl = '';
      
      if (url.pathname.startsWith('/auth/')) {
        // Auth requests go to Layer 3 (Auth Validation)
        nextLayerUrl = env.LAYER2_WORKER_URL || 'https://evenour-auth-validator.evenour-in.workers.dev';
      } else {
        // API requests go to Layer 4 (Business Logic)
        nextLayerUrl = 'https://evenour-business-logic.evenour-in.workers.dev';
      }
      
      const forwardedRequest = new Request(`${nextLayerUrl}${url.pathname}${url.search}`, {
        method: request.method,
        headers: {
          ...Object.fromEntries(request.headers.entries()),
          'X-Forwarded-For': clientIP,
          'X-Layer-2': 'ddos-protection-passed'
        },
        body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined
      });

      console.log(`[Layer 2 - DDoS] Forwarding to: ${nextLayerUrl}${url.pathname}`);
      const response = await fetch(forwardedRequest);
      
      // Add security headers to response
      const securityHeaders = {
        ...corsHeaders,
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'X-XSS-Protection': '1; mode=block',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'X-Layer-2': 'ddos-protection'
      };

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: { ...Object.fromEntries(response.headers.entries()), ...securityHeaders }
      });

    } catch (error) {
      console.error('[Layer 2 - DDoS] Error:', error);
      return new Response('Internal Server Error', { status: 500, headers: corsHeaders });
    }
  }
};

async function isBot(userAgent: string, ip: string): Promise<boolean> {
  // Only block obvious bots, allow legitimate requests
  const botPatterns = [
    /googlebot/i, /bingbot/i, /slurp/i, /duckduckbot/i,
    /facebookexternalhit/i, /twitterbot/i, /linkedinbot/i,
    /crawler/i, /spider/i, /scraper/i,
    /python-requests/i, /automated/i, /script/i
  ];
  
  // Allow curl, browsers, and other legitimate clients
  const legitimatePatterns = [
    /mozilla/i, /chrome/i, /safari/i, /firefox/i, /edge/i,
    /curl/i, /postman/i, /insomnia/i
  ];
  
  // If it matches a legitimate pattern, allow it
  if (legitimatePatterns.some(pattern => pattern.test(userAgent))) {
    return false;
  }
  
  return botPatterns.some(pattern => pattern.test(userAgent));
}

async function isDDoSAttack(request: Request, ip: string, env: Env): Promise<boolean> {
  // Skip DDoS detection if KV is not available
  if (!env.RATE_LIMITER) {
    return false;
  }
  
  const now = Date.now();
  const windowMs = 10000; // 10 seconds
  const maxRequests = 50; // Max 50 requests in 10 seconds
  
  const key = `ddos:${ip}:${Math.floor(now / windowMs)}`;
  const count = parseInt(await env.RATE_LIMITER.get(key) || '0');
  
  if (count >= maxRequests) {
    return true;
  }
  
  await env.RATE_LIMITER.put(key, String(count + 1), { expirationTtl: windowMs / 1000 });
  return false;
}
