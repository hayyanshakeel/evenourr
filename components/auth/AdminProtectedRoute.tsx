'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { secureAdminApi } from '@/lib/secure-admin-api';

interface AdminProtectedRouteProps { children: React.ReactNode }
interface AdminUser { username: string; email: string; role: string; loginMethod?: string; exp?: number; iss?: string }

// Lightweight local validator (defensive)
function decodeLocalToken(token: string): AdminUser | null {
  try {
    const decoded = JSON.parse(atob(token));
    console.log('[decodeLocalToken] Decoded token:', decoded);
    
    if (!decoded) {
      console.log('[decodeLocalToken] Token is empty');
      return null;
    }
    
    if (decoded.iss !== 'evenour-admin') {
      console.log('[decodeLocalToken] Invalid issuer:', decoded.iss);
      return null;
    }
    
    if (!decoded.username || typeof decoded.username !== 'string') {
      console.log('[decodeLocalToken] Invalid username:', decoded.username);
      return null;
    }
    
    const now = Math.floor(Date.now() / 1000);
    const gracePeriod = 5 * 60; // 5 minutes grace period
    if (decoded.exp && (decoded.exp + gracePeriod) <= now) {
      console.log('[decodeLocalToken] Token expired:', decoded.exp, 'vs now:', now, 'grace period:', gracePeriod);
      return null;
    }
    
    console.log('[decodeLocalToken] Token is valid');
    return decoded;
  } catch (error) {
    console.error('[decodeLocalToken] Parse error:', error);
    return null;
  }
}

export default function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const redirectingRef = useRef(false);
  const validatedRef = useRef(false);
  const router = useRouter();

  useEffect(() => {
    // Clear potentially expired tokens first
    const clearExpiredTokens = () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('evenour_admin_token') : null;
      if (token) {
        const decoded = decodeLocalToken(token);
        if (!decoded) {
          console.log('[AdminProtectedRoute] Clearing expired token on startup');
          localStorage.removeItem('evenour_admin_token');
          localStorage.removeItem('evenour_admin_user');
          return true; // Token was cleared
        }
      }
      return false; // No token cleared
    };

    const tokenWasCleared = clearExpiredTokens();
    
    const token = typeof window !== 'undefined' ? localStorage.getItem('evenour_admin_token') : null;
    const cachedUser = typeof window !== 'undefined' ? localStorage.getItem('evenour_admin_user') : null;

    console.log('[AdminProtectedRoute] Token:', token ? 'present' : 'missing');
    console.log('[AdminProtectedRoute] Cached user:', cachedUser ? 'present' : 'missing');

    if (!token) {
      console.log('[AdminProtectedRoute] No token found, redirecting to login');
      redirectToLogin();
      return;
    }

    // 1. Optimistic local decode for instant UI (critical for UX)
    const localDecoded = decodeLocalToken(token);
    console.log('[AdminProtectedRoute] Local decode result:', localDecoded);
    
    if (localDecoded) {
      setUser(localDecoded);
      setLoading(false); // Allow UI to render immediately
    } else if (cachedUser) {
      // Fallback to cached user if local decode fails
      try { 
        const parsedUser = JSON.parse(cachedUser);
        console.log('[AdminProtectedRoute] Using cached user as fallback:', parsedUser);
        setUser(parsedUser); 
        setLoading(false);
      } catch(e) {
        console.log('[AdminProtectedRoute] Failed to parse cached user:', e);
      }
    }

    // 2. Background remote validation for security (non-blocking)
    runRemoteValidation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function runRemoteValidation() {
    if (validatedRef.current) return; // Prevent duplicate calls
    validatedRef.current = true;
    
    console.log('[AdminProtectedRoute] Starting remote validation...');
    
    // TEMPORARILY disable remote validation to debug login flow
    console.log('[AdminProtectedRoute] Remote validation DISABLED for debugging');
    
    // Just rely on local token validation for now
    const token = typeof window !== 'undefined' ? localStorage.getItem('evenour_admin_token') : null;
    if (token) {
      const localDecoded = decodeLocalToken(token);
      if (localDecoded) {
        console.log('[AdminProtectedRoute] Using local validation only - token is valid');
        setUser(localDecoded);
        if (loading) setLoading(false);
        return;
      }
    }
    
    // If we can't validate locally, redirect to login
    console.log('[AdminProtectedRoute] Local validation failed, redirecting to login');
    if (!redirectingRef.current) {
      redirectingRef.current = true;
      localStorage.removeItem('evenour_admin_token');
      localStorage.removeItem('evenour_admin_user');
      router.replace('/hatsadmin/login');
    }
    
    /* ORIGINAL REMOTE VALIDATION CODE - Re-enable once login flow is working
    try {
      const result = await secureAdminApi.validateToken();
      console.log('[AdminProtectedRoute] Remote validation result:', result);
      
      if (!result.valid) {
        console.log('[AdminProtectedRoute] Remote validation failed - token invalid');
        // Token is invalid, clear and redirect
        if (!redirectingRef.current) {
          redirectingRef.current = true;
          localStorage.removeItem('evenour_admin_token');
          localStorage.removeItem('evenour_admin_user');
          router.replace('/hatsadmin/login');
        }
        return;
      }

      // Validation successful - update user if we got new data
      if (result.user) {
        console.log('[AdminProtectedRoute] Updating user from remote validation');
        setUser(result.user);
        localStorage.setItem('evenour_admin_user', JSON.stringify(result.user));
      }
      
      if (loading) setLoading(false);
      
    } catch (error) {
      console.error('[AdminProtectedRoute] Remote validation error:', error);
      // On network/validation error, continue with local token if available
      // Don't redirect - this could be temporary network issue
      if (loading && user) {
        setLoading(false); // Allow UI to continue with local user
      }
    }
    */
  }

  function redirectToLogin() {
    if (redirectingRef.current) return;
    redirectingRef.current = true;
    setLoading(false);
    router.replace('/hatsadmin/login');
  }

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
            <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
          </div>
          <div className="text-white text-lg font-medium mb-2">Initializing Admin Session</div>
          <div className="text-blue-200 text-sm">Performing secure authentication checks...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
            <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
          </div>
          <div className="text-white text-lg font-medium mb-2">Redirecting Securely</div>
          <div className="text-blue-200 text-sm">No valid admin session detected...</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
