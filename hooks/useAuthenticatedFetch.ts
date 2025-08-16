'use client';

import { useAuth } from '@/components/auth/AuthContext';
import { useCallback } from 'react';

export function useAuthenticatedFetch() {
  const { user, getIdToken } = useAuth();

  const authenticatedFetch = useCallback(async (url: string, options: RequestInit = {}) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const token = await getIdToken();
      if (!token) {
        throw new Error('Failed to get authentication token');
      }

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      };

      const response = await fetch(url, {
        ...options,
        headers,
      });

      return response;
    } catch (error) {
      console.error('Authenticated fetch error:', error);
      throw error;
    }
  }, [user, getIdToken]);

  return { authenticatedFetch, isAuthenticated: !!user };
}
