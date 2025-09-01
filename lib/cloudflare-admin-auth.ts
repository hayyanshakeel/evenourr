/**
 * Cloudflare Workers Admin Authentication Service
 * Connects Next.js admin panel to Cloudflare Workers auth
 */

export interface CloudflareAuthConfig {
  workerUrl: string;
  adminUsername: string;
  fallbackCredentials?: {
    username: string;
    password: string;
    email: string;
  };
}

export interface AuthUser {
  username: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: AuthUser;
  edge?: string;
  error?: string;
}

export interface ValidationResponse {
  valid: boolean;
  user?: AuthUser;
  edge?: string;
  error?: string;
}

class CloudflareAdminAuth {
  private config: CloudflareAuthConfig;
  private token: string | null = null;

  constructor(config: CloudflareAuthConfig) {
    this.config = config;
    
    // Load token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('evenour_admin_token');
    }
  }

  /**
   * Login with username and password
   */
  async login(username: string, password: string): Promise<AuthResponse> {
    try {
      // Try Cloudflare Worker first if URL doesn't contain placeholder
      if (!this.config.workerUrl.includes('YOUR_SUBDOMAIN')) {
        const response = await fetch(`${this.config.workerUrl}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password })
        });

        if (response.ok) {
          const result = await response.json();
          
          if (result.success && result.token) {
            this.token = result.token;
            
            if (typeof window !== 'undefined') {
              localStorage.setItem('evenour_admin_token', result.token);
              localStorage.setItem('evenour_admin_user', JSON.stringify(result.user));
            }
            
            return {
              success: true,
              message: result.message,
              token: result.token,
              user: result.user,
              edge: 'cloudflare-worker'
            };
          }
        }
      }

      // Use fallback authentication for development
      if (this.config.fallbackCredentials) {
        return this.fallbackLogin(username, password);
      }

      return {
        success: false,
        error: 'Authentication failed'
      };

    } catch (error) {
      console.error('Cloudflare auth error:', error);
      
      // Fallback authentication if Cloudflare Worker is unavailable
      if (this.config.fallbackCredentials) {
        return this.fallbackLogin(username, password);
      }

      return {
        success: false,
        error: 'Authentication service unavailable'
      };
    }
  }

  /**
   * Fallback authentication for local development
   */
  private async fallbackLogin(username: string, password: string): Promise<AuthResponse> {
    const fallback = this.config.fallbackCredentials!;
    
    if (username === fallback.username && password === fallback.password) {
      // Generate a simple local token
      const localToken = btoa(JSON.stringify({
        username,
        email: fallback.email,
        role: 'admin',
        iat: Date.now(),
        exp: Date.now() + (8 * 60 * 60 * 1000), // 8 hours
        source: 'fallback'
      }));

      this.token = localToken;

      if (typeof window !== 'undefined') {
        localStorage.setItem('evenour_admin_token', localToken);
        localStorage.setItem('evenour_admin_user', JSON.stringify({
          username,
          email: fallback.email,
          role: 'admin'
        }));
      }

      console.log('⚠️ Using fallback authentication');

      return {
        success: true,
        message: 'Authenticated (fallback)',
        token: localToken,
        user: {
          username,
          email: fallback.email,
          role: 'admin'
        }
      };
    }

    return {
      success: false,
      error: 'Invalid credentials'
    };
  }

  /**
   * Validate current token
   */
  async validateToken(token?: string): Promise<ValidationResponse> {
    const authToken = token || this.token;
    
    if (!authToken) {
      return { valid: false, error: 'No token provided' };
    }

    try {
      // Check if it's a fallback token first
      if (authToken.startsWith('eyJ') === false) {
        try {
          const decoded = JSON.parse(atob(authToken));
          if (decoded.source === 'fallback' && decoded.exp > Date.now()) {
            return {
              valid: true,
              user: {
                username: decoded.username,
                email: decoded.email,
                role: decoded.role
              }
            };
          }
        } catch (e) {
          // Not a fallback token, continue with Cloudflare validation
        }
      }

      // Skip Cloudflare validation if using placeholder URL
      if (this.config.workerUrl.includes('YOUR_SUBDOMAIN')) {
        console.warn('⚠️  Cloudflare Worker URL not configured, using fallback auth');
        throw new Error('Cloudflare Worker not configured');
      }

      // Validate with Cloudflare Workers
      const response = await fetch(`${this.config.workerUrl}/auth/validate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json() as ValidationResponse;

      if (!data.valid) {
        // Clear invalid token
        this.clearAuth();
      }

      return data;

    } catch (error) {
      console.error('❌ Token validation error:', error);
      
      // Try fallback validation if available
      if (this.config.fallbackCredentials && authToken) {
        try {
          const decoded = JSON.parse(atob(authToken));
          if (decoded.source === 'fallback' && decoded.exp > Date.now()) {
            console.log('✅ Using fallback token validation');
            return {
              valid: true,
              user: {
                username: decoded.username,
                email: decoded.email,
                role: decoded.role
              }
            };
          }
        } catch (e) {
          console.error('❌ Fallback token validation failed:', e);
        }
      }

      return { valid: false, error: error instanceof Error ? error.message : 'Validation failed' };
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    if (this.token) {
      try {
        await fetch(`${this.config.workerUrl}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Accept': 'application/json',
          }
        });
      } catch (error) {
        console.warn('⚠️ Logout request failed (continuing anyway):', error);
      }
    }

    this.clearAuth();
  }

  /**
   * Clear authentication data
   */
  private clearAuth(): void {
    this.token = null;
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('evenour_admin_token');
      localStorage.removeItem('evenour_admin_user');
    }
  }

  /**
   * Get current user from localStorage
   */
  getCurrentUser(): AuthUser | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('evenour_admin_user');
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  }

  /**
   * Get current token
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.token && !!this.getCurrentUser();
  }
}

// Default configuration
const defaultConfig: CloudflareAuthConfig = {
  workerUrl: process.env.NEXT_PUBLIC_CF_WORKER_URL || 'https://evenour-admin-auth.evenour-in.workers.dev',
  adminUsername: process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin',
  fallbackCredentials: {
    username: 'admin',
    password: 'Admin@123!Secure',
    email: 'admin@evenour.com'
  }
};

// Create singleton instance
export const cloudflareAuth = new CloudflareAdminAuth(defaultConfig);

// Legacy compatibility exports
export async function authenticateAdmin(username: string, password: string) {
  return await cloudflareAuth.login(username, password);
}

export async function validateAdminToken(token?: string) {
  return await cloudflareAuth.validateToken(token);
}

export async function logoutAdmin() {
  return await cloudflareAuth.logout();
}

export function getAdminUser() {
  return cloudflareAuth.getCurrentUser();
}

export function isAdminAuthenticated() {
  return cloudflareAuth.isAuthenticated();
}
