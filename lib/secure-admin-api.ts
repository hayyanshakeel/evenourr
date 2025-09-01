/**
 * Secure Admin API Client
 * Routes all admin API requests through Cloudflare Workers gateway
 * with comprehensive security (DDoS protection, bot mitigation, etc.)
 */

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
  error?: string;
}

class SecureAdminApiClient {
  private authUrl: string;
  private apiUrl: string;
  private fallbackApiUrl: string;
  private token: string | null = null;
  private useCloudflare: boolean = true;

  constructor() {
    // Use the original working auth system for both auth AND API calls
    this.authUrl = 'https://evenour-admin-auth.evenour-in.workers.dev';
    this.apiUrl = 'https://evenour-admin-auth.evenour-in.workers.dev';
    
    // Fallback: Local Next.js API routes (for development)
    this.fallbackApiUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001';
    
    console.log('[SecureAdminApi] Simplified Architecture:');
    console.log('[SecureAdminApi] Auth & API Layer: https://evenour-admin-auth.evenour-in.workers.dev');
    
    // Load token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('evenour_admin_token') || localStorage.getItem('admin_token');
      console.log('[SecureAdminApi] Token loaded:', this.token ? 'present' : 'missing');
      
      // Validate token if present
      if (this.token) {
        try {
          const tokenPayload = JSON.parse(atob(this.token));
          const currentTime = Math.floor(Date.now() / 1000);
          if (tokenPayload.exp && tokenPayload.exp < currentTime) {
            console.warn('[SecureAdminApi] Token is expired on initialization, clearing it');
            this.token = null;
            localStorage.removeItem('evenour_admin_token');
            localStorage.removeItem('admin_token');
            localStorage.removeItem('evenour_admin_user');
          }
        } catch (error) {
          console.error('[SecureAdminApi] Invalid token on initialization, clearing it');
          this.token = null;
          localStorage.removeItem('evenour_admin_token');
          localStorage.removeItem('admin_token'); 
          localStorage.removeItem('evenour_admin_user');
        }
      }
    }
  }

  setToken(token: string) {
    this.token = token;
    console.log('[SecureAdminApi] Token set:', token ? 'present' : 'missing');
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T> & { status?: number }> {
    // Route authentication requests to the original working auth worker
    // Route admin panel APIs through the new 3-layer security system
    const isAuthRequest = endpoint.includes('/auth/');
    const baseUrl = isAuthRequest ? this.authUrl : this.apiUrl;
    const url = `${baseUrl}${endpoint}`;
    
    console.log('[SecureAdminApi] Request routing:', {
      url,
      method: options.method || 'GET',
      hasAuth: !!this.token,
      endpoint,
      isAuthRequest,
      system: isAuthRequest ? 'Original Auth Worker' : '3-Layer Security System'
    });

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add existing headers
    if (options.headers) {
      const headersObj = new Headers(options.headers);
      headersObj.forEach((value, key) => {
        headers[key] = value;
      });
    }

    // Add authentication header if token exists
    if (this.token && !endpoint.includes('/auth/login')) {
      headers['Authorization'] = `Bearer ${this.token}`;
      
      // Check if token is expired before making the request
      try {
        const tokenPayload = JSON.parse(atob(this.token));
        const currentTime = Math.floor(Date.now() / 1000);
        if (tokenPayload.exp && tokenPayload.exp < currentTime) {
          console.warn('[SecureAdminApi] Token is expired, removing it');
          this.token = null;
          if (typeof window !== 'undefined') {
            localStorage.removeItem('evenour_admin_token');
            localStorage.removeItem('admin_token');
          }
          delete headers['Authorization'];
        }
      } catch (tokenError) {
        console.error('[SecureAdminApi] Invalid token format, removing it');
        this.token = null;
        if (typeof window !== 'undefined') {
          localStorage.removeItem('evenour_admin_token');
          localStorage.removeItem('admin_token');
        }
        delete headers['Authorization'];
      }
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        mode: 'cors',
        credentials: 'omit'
      });

      console.log('[SecureAdminApi] Response status:', response.status);
      console.log('[SecureAdminApi] Response headers:', Object.fromEntries(response.headers.entries()));

      let data: any = null;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json();
          console.log('[SecureAdminApi] Parsed JSON data:', data);
        } catch (jsonError) {
          console.error('[SecureAdminApi] JSON parse error:', jsonError);
          const text = await response.text();
          console.log('[SecureAdminApi] Raw response text:', text);
          data = { success: false, error: 'Invalid JSON response' };
        }
      } else {
        const text = await response.text();
        console.log('[SecureAdminApi] Non-JSON response:', text);
        data = { success: false, error: `Non-JSON response: ${text}` };
      }

      if (!response.ok) {
        console.error('[SecureAdminApi] Request failed:', {
          status: response.status,
          statusText: response.statusText,
          url,
          endpoint,
          isAuthRequest,
          data,
          headers: Object.fromEntries(response.headers.entries())
        });

        // If it's an authentication error, try to refresh the token
        if (response.status === 401 && !endpoint.includes('/auth/login')) {
          console.log('[SecureAdminApi] Authentication failed, token may be expired');
          this.token = null;
          if (typeof window !== 'undefined') {
            localStorage.removeItem('evenour_admin_token');
            localStorage.removeItem('admin_token');
          }
        }

        return {
          success: false,
          error: data?.error || data?.message || `HTTP ${response.status}: ${response.statusText}`,
          details: data?.details || undefined,
          status: response.status,
        } as any;
      }

      console.log('[SecureAdminApi] Request successful:', {
        system: isAuthRequest ? 'Original Auth Worker' : '3-Layer Gateway',
        data
      });
      
      // Ensure we always return a proper response structure
      if (data && typeof data === 'object') {
        return { ...data, status: response.status };
      } else {
        // Handle cases where data might be null, undefined, or not an object
        return {
          success: true,
          data: data,
          status: response.status
        };
      }
    } catch (error) {
      console.error('[SecureAdminApi] Network/fetch error:', error);
      console.error('[SecureAdminApi] Request details:', {
        url,
        endpoint,
        isAuthRequest,
        method: options.method || 'GET',
        hasToken: !!this.token
      });
      console.error('[SecureAdminApi] Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      
      // Special handling for authentication-related errors
      let errorMessage = error instanceof Error ? error.message : 'Network request failed';
      
      // If this is not an auth request and we don't have a token, suggest login
      if (!isAuthRequest && !this.token) {
        errorMessage = 'Authentication required. Please login to access admin features.';
      }
      
      // Return a more detailed error response
      const errorResponse = {
        success: false,
        error: errorMessage,
        details: {
          url,
          endpoint,
          method: options.method || 'GET',
          timestamp: new Date().toISOString(),
          hasToken: !!this.token,
          isAuthRequest
        }
      };
      
      console.error('[SecureAdminApi] Returning error response:', errorResponse);
      return errorResponse as any;
    }
  }

  private buildQuery(params?: Record<string, any>): string {
    if (!params) return '';
    const qs = Object.entries(params)
      .filter(([_, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join('&');
    return qs ? `?${qs}` : '';
  }

  // Authentication methods
  async login(username: string, password: string): Promise<AuthResponse> {
    console.log('[SecureAdminApi] Starting login for:', username);
    
    try {
      // Use the new secure endpoint
      const response = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });

      console.log('[SecureAdminApi] Login response:', response);

      // Cast to AuthResponse since we know the structure from the API
      const authResponse = response as any;
      
      if (authResponse.success && authResponse.token) {
        // Store token
        this.token = authResponse.token;
        if (typeof window !== 'undefined') {
          localStorage.setItem('evenour_admin_token', authResponse.token);
          localStorage.setItem('evenour_session_id', authResponse.sessionId || '');
          if (authResponse.user) {
            localStorage.setItem('evenour_admin_user', JSON.stringify(authResponse.user));
          }
        }
        console.log('[SecureAdminApi] Login successful, token stored');
        
        return {
          success: true,
          token: authResponse.token,
          user: authResponse.user
        };
      } else {
        console.log('[SecureAdminApi] Login failed:', authResponse);
        return {
          success: false,
          error: authResponse.error || 'Login failed'
        };
      }
    } catch (error) {
      console.error('[SecureAdminApi] Login error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login request failed'
      } as AuthResponse;
    }
  }
  
  private getDeviceId(): string {
    if (typeof window === 'undefined') return 'unknown';
    
    let deviceId = localStorage.getItem('evenour_device_id');
    if (!deviceId) {
      deviceId = crypto.randomUUID();
      localStorage.setItem('evenour_device_id', deviceId);
    }
    return deviceId;
  }
  
  private setupTokenRefresh(expiresIn: number): void {
    // Refresh token 5 minutes before expiry
    const refreshTime = (expiresIn - 300) * 1000;
    
    setTimeout(async () => {
      await this.refreshToken();
    }, refreshTime);
  }
  
  async refreshToken(): Promise<boolean> {
    const refreshToken = localStorage.getItem('evenour_refresh_token');
    if (!refreshToken) return false;
    
    try {
      const response = await this.request('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });
      
      const result = response as any;
      if (result.success && result.accessToken) {
        this.token = result.accessToken;
        localStorage.setItem('evenour_admin_token', result.accessToken);
        this.setupTokenRefresh(result.expiresIn);
        return true;
      }
    } catch (error) {
      console.error('[SecureAdminApi] Token refresh failed:', error);
    }
    
    return false;
  }

  async logout(): Promise<void> {
    await this.request('/auth/logout', {
      method: 'POST',
    });

    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('evenour_admin_token');
      localStorage.removeItem('evenour_refresh_token');
      localStorage.removeItem('evenour_session_id');
      localStorage.removeItem('evenour_admin_user');
    }
  }

  async validateToken(): Promise<{ valid: boolean; user?: any; status?: number; error?: string }> {
    if (!this.token) {
      return { valid: false };
    }

    try {
      const response = await this.request('/auth/validate', {
        method: 'POST',
      });

      // If remote validation succeeded
      if (response.success && (response as any).valid) {
        return {
          valid: true,
          user: (response as any).user,
          status: (response as any).status
        };
      }

      return { valid: false, error: (response as any).error, status: (response as any).status };
    } catch (error) {
      console.error('[SecureAdminApi] Validation error:', error);
      return { valid: false, error: 'Validation failed' };
    }
  }

  // Dashboard API
  async getDashboardStats(): Promise<ApiResponse> {
    // Check if we have a valid token before making the request
    if (!this.token) {
      return {
        success: false,
        error: 'Authentication required. Please login to access dashboard stats.'
      } as ApiResponse;
    }
    
    return this.request('/api/admin/dashboard/metrics');
  }

  // Products API
  async getProducts(params?: Record<string, any>): Promise<ApiResponse> {
    return this.request(`/api/admin/products${this.buildQuery(params)}`);
  }

  async createProduct(productData: any): Promise<ApiResponse> {
    return this.request('/api/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id: string, productData: any): Promise<ApiResponse> {
    return this.request(`/api/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id: string): Promise<ApiResponse> {
    return this.request(`/api/admin/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Orders API
  async getOrders(params?: Record<string, any>): Promise<ApiResponse> {
    return this.request(`/api/admin/orders${this.buildQuery(params)}`);
  }

  async getOrder(id: string): Promise<ApiResponse> {
    return this.request(`/api/admin/orders/${id}`);
  }

  async createOrder(payload: any): Promise<ApiResponse> {
    return this.request('/api/admin/orders', { method: 'POST', body: JSON.stringify(payload) });
  }

  async updateOrderStatus(id: string, status: string): Promise<ApiResponse> {
    return this.request(`/api/admin/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async getOrderStats(): Promise<ApiResponse> {
    return this.request('/api/admin/orders/stats');
  }

  // Customers API
  async getCustomers(params?: Record<string, any>): Promise<ApiResponse> {
    return this.request(`/api/admin/customers${this.buildQuery(params)}`);
  }

  async getCustomer(id: string): Promise<ApiResponse> {
    return this.request(`/api/admin/customers/${id}`);
  }

  // Categories / Collections
  async getCategories(params?: Record<string, any>): Promise<ApiResponse> {
    return this.request(`/api/admin/categories${this.buildQuery(params)}`);
  }

  async getCategory(id: string): Promise<ApiResponse> {
    return this.request(`/api/admin/categories/${id}`);
  }

  async createCategory(payload: any): Promise<ApiResponse> {
    return this.request('/api/admin/categories', { method: 'POST', body: JSON.stringify(payload) });
  }

  async updateCategory(id: string, payload: any): Promise<ApiResponse> {
    return this.request(`/api/admin/categories/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  }

  async deleteCategory(id: string): Promise<ApiResponse> {
    return this.request(`/api/admin/categories/${id}`, { method: 'DELETE' });
  }

  async getCollections(params?: Record<string, any>): Promise<ApiResponse> {
    return this.request(`/api/admin/collections${this.buildQuery(params)}`);
  }

  async getCollection(id: string): Promise<ApiResponse> {
    return this.request(`/api/admin/collections/${id}`);
  }

  async createCollection(payload: any): Promise<ApiResponse> {
    return this.request('/api/admin/collections', { method: 'POST', body: JSON.stringify(payload) });
  }

  async updateCollection(id: string, payload: any): Promise<ApiResponse> {
    return this.request(`/api/admin/collections/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  }

  async deleteCollection(id: string): Promise<ApiResponse> {
    return this.request(`/api/admin/collections/${id}`, { method: 'DELETE' });
  }

  // Inventory & Warehouses
  async getInventory(params?: Record<string, any>): Promise<ApiResponse> {
    return this.request(`/api/admin/inventory${this.buildQuery(params)}`);
  }

  async getInventoryStats(): Promise<ApiResponse> {
    return this.request('/api/admin/inventory/stats');
  }

  async exportInventory(params?: Record<string, any>): Promise<ApiResponse> {
    return this.request(`/api/admin/inventory/export${this.buildQuery(params)}`);
  }

  async getWarehouses(): Promise<ApiResponse> {
    return this.request('/api/admin/warehouses');
  }

  // Returns extended
  async getReturns(params?: Record<string, any>): Promise<ApiResponse> {
    return this.request(`/api/admin/returns${this.buildQuery(params)}`);
  }

  async getReturnStats(params?: Record<string, any>): Promise<ApiResponse> {
    return this.request(`/api/admin/returns/stats${this.buildQuery(params)}`);
  }

  async getReturn(id: string): Promise<ApiResponse> {
    return this.request(`/api/admin/returns/${id}`);
  }

  async updateReturn(id: string, payload: any): Promise<ApiResponse> {
    return this.request(`/api/admin/returns/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  }

  async addReturnUpdate(id: string, payload: any): Promise<ApiResponse> {
    return this.request(`/api/admin/returns/${id}/updates`, { method: 'POST', body: JSON.stringify(payload) });
  }

  async createReturn(payload: any): Promise<ApiResponse> {
    return this.request('/api/admin/returns', { method: 'POST', body: JSON.stringify(payload) });
  }

  // Dashboard metrics (renamed for clarity)
  async getDashboardMetrics(): Promise<ApiResponse> {
    // Check if we have a valid token before making the request
    if (!this.token) {
      return {
        success: false,
        error: 'Authentication required. Please login to access dashboard metrics.'
      } as ApiResponse;
    }
    
    return this.request('/api/admin/dashboard/metrics');
  }

  // Utility methods already defined above - no duplicates needed
  isAuthenticated(): boolean {
    return !!this.token;
  }
  
  // Check if current token is valid (not expired)
  hasValidToken(): boolean {
    if (!this.token) return false;
    
    try {
      const tokenPayload = JSON.parse(atob(this.token));
      const currentTime = Math.floor(Date.now() / 1000);
      return tokenPayload.exp && tokenPayload.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  getCurrentUser(): any | null {
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
}

// Create singleton instance
export const secureAdminApi = new SecureAdminApiClient();

// Legacy compatibility - update the cloudflare auth to use secure API
export const cloudflareAuth = {
  async login(username: string, password: string) {
    return secureAdminApi.login(username, password);
  },

  async logout() {
    return secureAdminApi.logout();
  },

  async validateToken() {
    const result = await secureAdminApi.validateToken();
    return {
      valid: result.valid,
      user: result.user,
      edge: 'cloudflare-gateway'
    };
  },

  getToken() {
    return secureAdminApi.getToken();
  },

  getCurrentUser() {
    return secureAdminApi.getCurrentUser();
  },

  isAuthenticated() {
    return secureAdminApi.isAuthenticated();
  }
};

export default secureAdminApi;
