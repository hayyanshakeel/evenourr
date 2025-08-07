import { useEffect, useState } from 'react';

export function useAdminAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status and extract token from localStorage
    const checkAuthStatus = () => {
      // Always check localStorage first for the Firebase token
      const storedToken = localStorage.getItem('firebaseToken');
      if (storedToken) {
        setToken(storedToken);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsReady(true);
    };

    checkAuthStatus();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'firebaseToken') {
        setToken(e.newValue);
        setIsAuthenticated(!!e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const getAuthHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Always add Authorization header if we have a token
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  };

  const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
    try {
      // Always get fresh token from localStorage
      const currentToken = localStorage.getItem('firebaseToken');
      
      if (!currentToken) {
        console.warn('No authentication token available for request to:', url);
        throw new Error('No authentication token available');
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}`,
        ...options.headers as Record<string, string>,
      };

      console.log('Making authenticated request to:', url);

      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });

      if (response.status === 401) {
        console.warn('Authentication failed - token may be invalid or expired');
        localStorage.removeItem('firebaseToken');
        setToken(null);
        setIsAuthenticated(false);
        throw new Error('Authentication failed');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  };

  return {
    token,
    isReady,
    getAuthHeaders,
    makeAuthenticatedRequest,
    isAuthenticated,
  };
}
