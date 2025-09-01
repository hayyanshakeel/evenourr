'use client';

import React, { createContext, useContext } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';

interface AuthContextType {
  user: { uid: string; email: string; emailVerified?: boolean } | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  token: string | null;
  isReady: boolean;
  waitForAuthResolution: () => Promise<void>;
  waitForToken: () => Promise<string>;
  makeAuthenticatedRequest: (url: string, options?: RequestInit) => Promise<Response>;
}

// Create the context with proper typing
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const adminAuth = useAdminAuth();

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      const result = await adminAuth.signIn(email, password);
      if (!result.success) {
        throw new Error(result.error || 'Authentication failed');
      }
      console.log('✅ Admin Authentication successful');
    } catch (error) {
      console.error('❌ Authentication failed:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    await adminAuth.signOut();
  };

  const value: AuthContextType = {
    user: adminAuth.user,
    loading: !adminAuth.isReady,
    isAuthenticated: adminAuth.isAuthenticated,
    signIn,
    logout,
    token: adminAuth.token,
    isReady: adminAuth.isReady,
    waitForAuthResolution: adminAuth.waitForAuthResolution,
    waitForToken: async () => (await adminAuth.waitForToken()) || '',
    makeAuthenticatedRequest: adminAuth.makeAuthenticatedRequest,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
      console.error('❌ EVR Authentication failed:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await evr.signOut();
      console.log('✅ EVR Logout successful');
    } catch (error) {
      console.error('❌ EVR Logout failed:', error);
      throw error;
    }
  };

  const contextValue: AuthContextType = {
    user: evr.user,
    loading: !evr.isReady,
    isAuthenticated: evr.isAuthenticated,
    signIn,
    logout,
    token: evr.getToken(),
    isReady: evr.isReady,
    waitForAuthResolution: evr.waitForAuthResolution,
    waitForToken: async () => {
      const token = await evr.waitForToken();
      return token || '';
    },
    makeAuthenticatedRequest: evr.makeAuthenticatedRequest,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the useAuth hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provide a warning to use EVR instead
export const AuthContextProvider = AuthProvider;
export default AuthProvider;
