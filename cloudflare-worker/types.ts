// Cloudflare Worker Types
declare global {
  interface KVNamespace {
    get(key: string): Promise<string | null>;
    put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
    delete(key: string): Promise<void>;
    list(options?: { prefix?: string; limit?: number }): Promise<{ keys: Array<{ name: string }> }>;
  }
}

export interface CloudflareEnv {
  AUTH_TOKENS: KVNamespace;
  SECURITY_EVENTS: KVNamespace;
  USER_SESSIONS: KVNamespace;
  JWT_SECRET: string;
  ADMIN_USERNAME: string;
  ADMIN_PASSWORD: string;
  ADMIN_EMAIL: string;
  CLOUDFLARE_TEAM_DOMAIN: string;
  CLOUDFLARE_ACCESS_AUD: string;
}

export interface SessionData {
  id: string;
  tokenId: string;
  username: string;
  email: string;
  role: string;
  loginMethod: string;
  createdAt: number;
  expiresAt: number;
  ip: string;
  userAgent: string;
  country: string;
  zeroTrustData?: any;
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  type: string;
  username?: string;
  sessionId?: string;
  ip?: string;
  country?: string;
  userAgent?: string;
  reason?: string;
}

export interface JWTPayload {
  sub: string;
  username: string;
  email: string;
  role: string;
  loginMethod: string;
  iat: number;
  exp: number;
  aud: string;
  iss: string;
  jti: string;
}
