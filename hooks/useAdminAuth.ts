import { useEffect, useState } from 'react';

export function useAdminAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('firebaseToken');
    setToken(storedToken);
    setIsReady(true);
  }, []);

  const getAuthHeaders = (): Record<string, string> => {
    if (!token) {
      console.warn('No Firebase token available for API request');
      return {};
    }
    
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
    const authHeaders = getAuthHeaders();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...(options.headers as Record<string, string> || {}),
    };

    return fetch(url, {
      ...options,
      headers,
    });
  };

  return {
    token,
    isReady,
    getAuthHeaders,
    makeAuthenticatedRequest,
    isAuthenticated: !!token,
  };
}
