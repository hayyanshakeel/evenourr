/**
 * Simple Admin Login Utility
 * This handles the actual login process and token management
 */

interface LoginResult {
  success: boolean;
  error?: string;
  token?: string;
  user?: any;
}

export async function performAdminLogin(username: string, password: string): Promise<LoginResult> {
  try {
    console.log('[AdminLogin] Starting login process for:', username);
    
    const response = await fetch('https://evenour-admin-auth.evenour-in.workers.dev/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    console.log('[AdminLogin] Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.log('[AdminLogin] Login failed:', errorData);
      return {
        success: false,
        error: errorData.error || `HTTP ${response.status}: ${response.statusText}`
      };
    }

    const data = await response.json();
    console.log('[AdminLogin] Login successful:', data);

    if (data.success && data.token) {
      // Store token and user data
      localStorage.setItem('evenour_admin_token', data.token);
      localStorage.setItem('evenour_admin_user', JSON.stringify(data.user));
      
      // Also store in legacy keys for compatibility
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));

      console.log('[AdminLogin] Token stored successfully');
      
      return {
        success: true,
        token: data.token,
        user: data.user
      };
    } else {
      return {
        success: false,
        error: data.error || 'Login failed - no token received'
      };
    }
  } catch (error) {
    console.error('[AdminLogin] Network error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error'
    };
  }
}

export function getStoredToken(): string | null {
  return localStorage.getItem('evenour_admin_token') || localStorage.getItem('admin_token');
}

export function getStoredUser(): any | null {
  const userStr = localStorage.getItem('evenour_admin_user') || localStorage.getItem('admin_user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
}

export function clearStoredAuth(): void {
  localStorage.removeItem('evenour_admin_token');
  localStorage.removeItem('evenour_admin_user');
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
}

export async function validateStoredToken(): Promise<boolean> {
  const token = getStoredToken();
  if (!token) return false;

  try {
    console.log('[AdminLogin] Validating stored token...');
    
    const response = await fetch('https://evenour-admin-auth.evenour-in.workers.dev/api/admin/orders', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const isValid = response.ok;
    console.log('[AdminLogin] Token validation result:', isValid);
    
    if (!isValid) {
      console.log('[AdminLogin] Token invalid, clearing stored auth');
      clearStoredAuth();
    }
    
    return isValid;
  } catch (error) {
    console.error('[AdminLogin] Token validation error:', error);
    clearStoredAuth();
    return false;
  }
}
