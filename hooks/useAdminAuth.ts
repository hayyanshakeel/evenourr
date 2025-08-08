import { useEffect, useRef, useState } from 'react';
import { auth } from '@/lib/firebase';
import type { User } from 'firebase/auth';

export function useAdminAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false); // auth state resolved (user or null)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const waitersRef = useRef<((t: string | null) => void)[]>([]);
  const readyWaitersRef = useRef<(() => void)[]>([]);
  const firstAuthedRef = useRef(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (fbUser) => {
      if (fbUser) {
        try {
          const idToken = await fbUser.getIdToken();
          setToken(idToken);
          setUser(fbUser);
          setIsAuthenticated(true);
          if (!firstAuthedRef.current) {
            console.log('[auth] first token acquired');
            firstAuthedRef.current = true;
          }
          waitersRef.current.forEach((r) => r(idToken));
        } catch (e) {
          console.error('[auth] getIdToken failed', e);
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
          waitersRef.current.forEach((r) => r(null));
        }
      } else {
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        waitersRef.current.forEach((r) => r(null));
      }
      waitersRef.current = [];
      setIsReady(true);
      readyWaitersRef.current.forEach((r) => r());
      readyWaitersRef.current = [];
    });
    return () => unsubscribe();
  }, []);

  function waitForAuthResolution(timeoutMs = 5000) {
    if (isReady) return Promise.resolve();
    return new Promise<void>((resolve) => {
      const timer = setTimeout(() => resolve(), timeoutMs);
      readyWaitersRef.current.push(() => {
        clearTimeout(timer);
        resolve();
      });
    });
  }

  function waitForToken(timeoutMs = 5000) {
    if (token) return Promise.resolve(token);
    return new Promise<string | null>((resolve) => {
      const started = Date.now();
      const timer = setTimeout(() => resolve(null), timeoutMs);
      waitersRef.current.push((t) => {
        clearTimeout(timer);
        resolve(t);
      });
      // If token still missing after auth resolved & user absent, resolve sooner
      readyWaitersRef.current.push(() => {
        if (!user) {
          const remaining = timeoutMs - (Date.now() - started);
          if (remaining > 0) {
            // allow remaining time in case immediate sign-in follows
            return;
          }
          resolve(null);
        }
      });
    });
  }

  const getAuthHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  };

  async function internalFetch(url: string, options: RequestInit, attempt = 1): Promise<Response> {
    const response = await fetch(url, options);
    if (response.status === 401 && attempt === 1 && user) {
      try {
        console.log('[auth] 401 -> forced refresh attempt');
        const refreshed = await user.getIdToken(true);
        setToken(refreshed);
        const retryHeaders = { ...(options.headers as Record<string, string>), Authorization: `Bearer ${refreshed}` };
        return internalFetch(url, { ...options, headers: retryHeaders }, 2);
      } catch (e) {
        console.warn('[auth] forced refresh failed', e);
      }
    }
    return response;
  }

  const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
    // Ensure auth state known
    if (!isReady) await waitForAuthResolution();

    // If authenticated but token missing (rare), wait briefly for token
    let activeToken = token;
    if (isAuthenticated && (!activeToken || !user)) {
      activeToken = await waitForToken(3000);
    }

    // If not authenticated after resolution
    if (!isAuthenticated) {
      throw new Error('Not authenticated');
    }

    if (!activeToken || !user) {
      throw new Error('Token acquisition failed');
    }

    // Attempt a fresh non-forced refresh; ignore failure
    try {
      activeToken = await user.getIdToken();
      setToken(activeToken);
    } catch {
      console.warn('[auth] token refresh (non-forced) failed — using existing');
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${activeToken}`,
      ...(options.headers as Record<string, string>),
    };

    const response = await internalFetch(url, { ...options, headers, credentials: 'include' });

    if (response.status === 401) {
      console.warn('[auth] final 401 after retry - clearing auth state');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      throw new Error('Authentication failed');
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  };

  const makeAuthenticatedJson = async <T = any>(url: string, options: RequestInit = {}) => {
    const res = await makeAuthenticatedRequest(url, options);
    return res.json() as Promise<T>;
  };

  return {
    token,
    isReady,
    isAuthenticated,
    user,
    getAuthHeaders,
    makeAuthenticatedRequest,
    makeAuthenticatedJson,
    waitForToken,
    waitForAuthResolution,
  };
}
