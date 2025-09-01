/**
 * Enhanced Admin Authentication Hook
 * Supports both WebAuthn and password-based authentication
 */

import { useState, useEffect, useCallback } from 'react';
import { WebAuthnClient } from '@/lib/webauthn-client';
import { secureAdminApi } from '@/lib/secure-admin-api';

interface AdminUser {
  id: string;
  email: string;
  emailVerified: boolean;
}

interface AdminAuthState {
  isReady: boolean;
  isAuthenticated: boolean;
  user: AdminUser | null;
  token: string | null;
  webauthnSupported: boolean;
}

const TOKEN_KEY = 'evenour_admin_token';
const USER_KEY = 'evenour_admin_user';

export function useAdminAuth() {
  const [authState, setAuthState] = useState<AdminAuthState>({
    isReady: false,
    isAuthenticated: false,
    user: null,
    token: null,
    webauthnSupported: false
  });

  const webauthnClient = new WebAuthnClient();

  useEffect(() => {
    // Initialize auth state from localStorage
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('evenour_admin_token') || localStorage.getItem('admin_token');
        const storedUser = localStorage.getItem('evenour_admin_user') || localStorage.getItem('admin_user');
        const webauthnSupported = WebAuthnClient.isSupported();
        
        console.log('[useAdminAuth] Initializing auth state:', {
          hasToken: !!storedToken,
          hasUser: !!storedUser,
          webauthnSupported
        });

        if (storedToken) {
          // Set the token in the API client immediately
          secureAdminApi.setToken(storedToken);
          
          if (storedUser) {
            try {
              const user = JSON.parse(storedUser);
              
              // Test if the token is still valid by making a simple API call
              const testResponse = await fetch('https://evenour-admin-auth.evenour-in.workers.dev/api/admin/orders', {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${storedToken}`,
                  'Content-Type': 'application/json',
                },
              });

              if (testResponse.ok) {
                console.log('[useAdminAuth] Token validation successful, user authenticated');
                setAuthState({ 
                  isReady: true, 
                  isAuthenticated: true, 
                  user, 
                  token: storedToken, 
                  webauthnSupported 
                });
              } else {
                console.log('[useAdminAuth] Token validation failed, clearing stored auth');
                localStorage.removeItem('evenour_admin_token');
                localStorage.removeItem('evenour_admin_user');
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_user');
                setAuthState(prev => ({ ...prev, isReady: true, webauthnSupported }));
              }
            } catch (parseError) {
              console.error('[useAdminAuth] Error parsing stored user data:', parseError);
              localStorage.removeItem('evenour_admin_token');
              localStorage.removeItem('evenour_admin_user');
              localStorage.removeItem('admin_token');
              localStorage.removeItem('admin_user');
              setAuthState(prev => ({ ...prev, isReady: true, webauthnSupported }));
            }
          } else {
            console.log('[useAdminAuth] Token found but no user data');
            setAuthState(prev => ({ ...prev, isReady: true, webauthnSupported }));
          }
        } else {
          console.log('[useAdminAuth] No stored token found');
          setAuthState(prev => ({ ...prev, isReady: true, webauthnSupported }));
        }
      } catch (error) {
        console.error('[useAdminAuth] Error during auth initialization:', error);
        setAuthState(prev => ({ ...prev, isReady: true, webauthnSupported: WebAuthnClient.isSupported() }));
      }
    };
    
    initAuth();
  }, []);

  const verifyStoredToken = async (token: string): Promise<boolean> => {
    try {
      secureAdminApi.setToken(token);
      const result = await secureAdminApi.validateToken();
      return result.valid === true;
    } catch (e) {
      console.error('Token validation (gateway) failed:', e);
      return false;
    }
  };

  const signInWithPassword = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('[useAdminAuth] Attempting password login for:', email);
      
      const response = await fetch('https://evenour-admin-auth.evenour-in.workers.dev/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Login failed' };
      }

      const data = await response.json();
      
      if (data.success && data.token) {
        const user: AdminUser = {
          id: data.user.id,
          email: data.user.email,
          emailVerified: true
        };
        
        // Store authentication data
        localStorage.setItem('evenour_admin_token', data.token);
        localStorage.setItem('evenour_admin_user', JSON.stringify(user));
        localStorage.setItem('admin_token', data.token); // Legacy compatibility
        localStorage.setItem('admin_user', JSON.stringify(user)); // Legacy compatibility
        
        // Set token in API client
        secureAdminApi.setToken(data.token);
        
        // Update auth state
        setAuthState(prev => ({ 
          ...prev, 
          isAuthenticated: true, 
          user, 
          token: data.token 
        }));
        
        console.log('[useAdminAuth] Password login successful');
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      console.error('[useAdminAuth] Password login error:', error);
      return { success: false, error: 'Network error' };
    }
  }, []);

  const signInWithWebAuthn = useCallback(async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (!authState.webauthnSupported) {
      return { success: false, error: 'WebAuthn is not supported in this browser' };
    }

    try {
      const result = await webauthnClient.authenticate(email);
      
      if (!result.success || !result.tokens || !result.user) {
        return { success: false, error: result.error || 'WebAuthn authentication failed' };
      }

      // Store auth data
      localStorage.setItem('admin_token', result.tokens.accessToken);
      localStorage.setItem('admin_user', JSON.stringify(result.user));

      setAuthState(prev => ({
        ...prev,
        isAuthenticated: true,
        user: result.user,
        token: result.tokens!.accessToken
      }));

      return { success: true };
    } catch (error) {
      console.error('WebAuthn sign in error:', error);
      return { success: false, error: 'WebAuthn authentication failed' };
    }
  }, [authState.webauthnSupported, webauthnClient]);

  const enrollWebAuthn = useCallback(async (email: string, displayName?: string): Promise<{ success: boolean; error?: string }> => {
    if (!authState.webauthnSupported) {
      return { success: false, error: 'WebAuthn is not supported in this browser' };
    }

    try {
      const result = await webauthnClient.enroll(email, displayName);
      
      if (!result.success || !result.tokens || !result.user) {
        return { success: false, error: result.error || 'WebAuthn enrollment failed' };
      }

      // Store auth data
      localStorage.setItem('admin_token', result.tokens.accessToken);
      localStorage.setItem('admin_user', JSON.stringify(result.user));

      setAuthState(prev => ({
        ...prev,
        isAuthenticated: true,
        user: result.user,
        token: result.tokens!.accessToken
      }));

      return { success: true };
    } catch (error) {
      console.error('WebAuthn enrollment error:', error);
      return { success: false, error: 'WebAuthn enrollment failed' };
    }
  }, [authState.webauthnSupported, webauthnClient]);

  // Generic signIn method that tries password first, then suggests WebAuthn
  const signIn = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Try password authentication first
    const passwordResult = await signInWithPassword(email, password);
    
    if (passwordResult.success) {
      return passwordResult;
    }

    // If password failed and WebAuthn is supported, suggest WebAuthn
    if (authState.webauthnSupported && passwordResult.error?.includes('Invalid credentials')) {
      return { 
        success: false, 
        error: `${passwordResult.error}. You can also try WebAuthn authentication if you have enrolled a device.`
      };
    }

    return passwordResult;
  }, [signInWithPassword, authState.webauthnSupported]);

  const signOut = useCallback(async () => {
    try { await secureAdminApi.logout(); } catch {}
    localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY);
    localStorage.removeItem('admin_token'); localStorage.removeItem('admin_user');
    setAuthState(prev => ({ ...prev, isAuthenticated: false, user: null, token: null }));
  }, []);

  const waitForAuthResolution = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      if (authState.isReady) {
        resolve();
      } else {
        const checkReady = () => {
          if (authState.isReady) {
            resolve();
          } else {
            setTimeout(checkReady, 100);
          }
        };
        checkReady();
      }
    });
  }, [authState.isReady]);

  const waitForToken = useCallback(async (): Promise<string | null> => {
    await waitForAuthResolution();
    return authState.token;
  }, [authState.token, waitForAuthResolution]);

  const makeAuthenticatedRequest = useCallback(async (url: string, options: RequestInit = {}): Promise<Response> => {
    // Use the working admin auth worker for all API requests
    const gatewayBase = 'https://evenour-admin-auth.evenour-in.workers.dev';
    const token = await waitForToken();
    const gatewayToken = secureAdminApi.getToken() || token;

    let finalUrl = url;
    if (url.startsWith('/api/admin')) {
      // Route all admin API calls through the working gateway
      finalUrl = `${gatewayBase}${url}`;
    } else if (url.startsWith('/hatsadmin')) {
      finalUrl = `${gatewayBase}${url}`;
    }

    return fetch(finalUrl, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': gatewayToken ? `Bearer ${gatewayToken}` : '',
        'Content-Type': (options.headers as any)?.['Content-Type'] || 'application/json'
      },
    });
  }, [waitForToken]);

  const getToken = useCallback(() => authState.token, [authState.token]);

  return {
    // Legacy properties for compatibility
    token: authState.token,
    isReady: authState.isReady,
    isAuthenticated: authState.isAuthenticated,
    user: authState.user ? {
      uid: authState.user.id,
      email: authState.user.email,
      emailVerified: authState.user.emailVerified
    } : null,
    
    // Methods
    signIn,
    signInWithPassword,
    signInWithWebAuthn,
    enrollWebAuthn,
    signOut,
    waitForAuthResolution,
    waitForToken,
    makeAuthenticatedRequest,
    getToken,
    
    // Admin-specific properties
    adminUser: authState.user,
    webauthnSupported: authState.webauthnSupported
  };
}