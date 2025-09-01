/**
 * Cloudflare Workers Deployment Configuration
 * Edge authentication and security layer
 */

// wrangler.toml configuration for Cloudflare Workers
export const CLOUDFLARE_CONFIG = `
name = "evenour-enterprise-auth"
main = "worker/index.ts"
compatibility_date = "2025-09-01"
compatibility_flags = ["nodejs_compat"]

# Environment variables
[env.production]
vars = { ENV = "production" }

# KV Namespaces
[[env.production.kv_namespaces]]
binding = "AUTH_TOKENS"
id = "your-kv-namespace-id"

[[env.production.kv_namespaces]]
binding = "SECURITY_EVENTS"
id = "your-security-kv-id"

# Durable Objects
[[env.production.durable_objects.bindings]]
name = "SESSION_MANAGER"
class_name = "SessionManager"

[[env.production.durable_objects.bindings]]
name = "RATE_LIMITER"
class_name = "RateLimiter"

# D1 Database
[[env.production.d1_databases]]
binding = "AUTH_DB"
database_name = "evenour-auth-db"
database_id = "your-d1-database-id"

# R2 Storage
[[env.production.r2_buckets]]
binding = "SECURITY_LOGS"
bucket_name = "evenour-security-logs"
`;

export interface WorkerRequest {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: string;
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
  };
}

export interface WorkerResponse {
  status: number;
  headers: Record<string, string>;
  body: string;
}

/**
 * Edge Authentication Worker
 * Runs on Cloudflare Edge for global auth validation
 */
export class EdgeAuthWorker {
  private kv: any; // KV namespace
  private durableObjects: any;

  constructor(env: any) {
    this.kv = env.AUTH_TOKENS;
    this.durableObjects = env.SESSION_MANAGER;
  }

  async handleRequest(request: WorkerRequest): Promise<WorkerResponse> {
    const url = new URL(request.url);
    
    // Route to appropriate handler
    if (url.pathname.startsWith('/auth/')) {
      return this.handleAuth(request);
    } else if (url.pathname.startsWith('/security/')) {
      return this.handleSecurity(request);
    } else {
      // Proxy to origin
      return this.proxyToOrigin(request);
    }
  }

  /**
   * Handle authentication requests at the edge
   */
  private async handleAuth(request: WorkerRequest): Promise<WorkerResponse> {
    const url = new URL(request.url);
    
    switch (url.pathname) {
      case '/auth/validate':
        return this.validateToken(request);
      case '/auth/challenge':
        return this.generateChallenge(request);
      case '/auth/revoke':
        return this.revokeToken(request);
      default:
        return {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Not found' })
        };
    }
  }

  /**
   * Validate token at edge with KV lookup
   */
  private async validateToken(request: WorkerRequest): Promise<WorkerResponse> {
    try {
      const authHeader = request.headers['authorization'];
      if (!authHeader) {
        return this.unauthorizedResponse('No authorization header');
      }

      const token = authHeader.replace('Bearer ', '');
      
      // Check KV cache first
      const cachedToken = await this.kv.get(`token:${token}`, { type: 'json' });
      
      if (!cachedToken) {
        return this.unauthorizedResponse('Token not found');
      }

      if (cachedToken.expiresAt < Date.now()) {
        // Remove expired token
        await this.kv.delete(`token:${token}`);
        return this.unauthorizedResponse('Token expired');
      }

      // Log successful validation
      await this.logSecurityEvent({
        type: 'token_validation',
        success: true,
        tokenId: cachedToken.id,
        userId: cachedToken.userId,
        ip: request.headers['cf-connecting-ip'],
        country: request.cf?.country
      });

      return {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          valid: true,
          user: cachedToken.user,
          permissions: cachedToken.permissions
        })
      };
    } catch (error) {
      console.error('Token validation error:', error);
      return this.errorResponse('Validation failed');
    }
  }

  /**
   * Generate WebAuthn challenge at edge
   */
  private async generateChallenge(request: WorkerRequest): Promise<WorkerResponse> {
    try {
      const challenge = this.generateSecureChallenge();
      const challengeId = crypto.randomUUID();

      // Store challenge in KV with TTL
      await this.kv.put(
        `challenge:${challengeId}`,
        JSON.stringify({
          challenge,
          createdAt: Date.now(),
          ip: request.headers['cf-connecting-ip']
        }),
        { expirationTtl: 300 } // 5 minutes
      );

      return {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId,
          challenge,
          timeout: 300000 // 5 minutes in ms
        })
      };
    } catch (error) {
      console.error('Challenge generation error:', error);
      return this.errorResponse('Challenge generation failed');
    }
  }

  /**
   * Revoke token at edge
   */
  private async revokeToken(request: WorkerRequest): Promise<WorkerResponse> {
    try {
      const body = JSON.parse(request.body || '{}');
      const tokenId = body.tokenId;

      if (!tokenId) {
        return this.badRequestResponse('Token ID required');
      }

      // Remove from KV
      await this.kv.delete(`token:${tokenId}`);

      await this.logSecurityEvent({
        type: 'token_revocation',
        tokenId,
        ip: request.headers['cf-connecting-ip']
      });

      return {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true })
      };
    } catch (error) {
      console.error('Token revocation error:', error);
      return this.errorResponse('Revocation failed');
    }
  }

  /**
   * Handle security monitoring requests
   */
  private async handleSecurity(request: WorkerRequest): Promise<WorkerResponse> {
    const url = new URL(request.url);
    
    switch (url.pathname) {
      case '/security/metrics':
        return this.getSecurityMetrics();
      case '/security/block':
        return this.blockIpAddress(request);
      default:
        return {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Not found' })
        };
    }
  }

  /**
   * Proxy requests to origin server
   */
  private async proxyToOrigin(request: WorkerRequest): Promise<WorkerResponse> {
    // This would proxy to your Next.js application
    // For now, return a placeholder
    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: 'Proxied to origin',
        edge: true,
        location: request.cf?.colo
      })
    };
  }

  // Helper methods
  private generateSecureChallenge(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode.apply(null, Array.from(array)));
  }

  private async logSecurityEvent(event: any): Promise<void> {
    // Log to KV or Durable Object
    const eventId = crypto.randomUUID();
    await this.kv.put(
      `security:${eventId}`,
      JSON.stringify({
        ...event,
        timestamp: new Date().toISOString(),
        id: eventId
      }),
      { expirationTtl: 86400 } // 24 hours
    );
  }

  private unauthorizedResponse(message: string): WorkerResponse {
    return {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Unauthorized', message })
    };
  }

  private badRequestResponse(message: string): WorkerResponse {
    return {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Bad Request', message })
    };
  }

  private errorResponse(message: string): WorkerResponse {
    return {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal Error', message })
    };
  }

  private async getSecurityMetrics(): Promise<WorkerResponse> {
    // Get security metrics from KV
    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Security metrics would be here',
        timestamp: new Date().toISOString()
      })
    };
  }

  private async blockIpAddress(request: WorkerRequest): Promise<WorkerResponse> {
    // Add IP to block list
    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'IP blocked' })
    };
  }
}
