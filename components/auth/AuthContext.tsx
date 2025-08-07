'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let refreshInterval: NodeJS.Timeout | null = null;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);
      
      // Clear any existing refresh interval
      if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
      }
      
      // Store or clear the Firebase token in localStorage
      if (user) {
        try {
          const token = await user.getIdToken();
          localStorage.setItem('firebaseToken', token);
          console.log('✅ Firebase token stored in localStorage');
          
          // Set up token refresh
          const refreshToken = async () => {
            try {
              const newToken = await user.getIdToken(true); // Force refresh
              localStorage.setItem('firebaseToken', newToken);
              console.log('✅ Firebase token refreshed');
            } catch (error) {
              console.error('Token refresh failed:', error);
            }
          };
          
          // Refresh token every 30 minutes (Firebase tokens expire after 1 hour)
          refreshInterval = setInterval(refreshToken, 30 * 60 * 1000);
          
        } catch (error) {
          console.error('Failed to get initial token:', error);
        }
      } else {
        localStorage.removeItem('firebaseToken');
        console.log('✅ Firebase token removed from localStorage');
      }
    });

    return () => {
      unsubscribe();
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('AuthContext: Starting sign in process...');
      console.log('AuthContext: Email:', email);
      
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('AuthContext: Sign in successful:', result.user.uid);
      
    } catch (error: any) {
      console.error('AuthContext: Sign in error:', error);
      
      // Handle rate limiting specifically
      if (error.code === 'auth/too-many-requests') {
        const enhancedError = new Error('Too many login attempts. Please wait a few minutes before trying again.');
        enhancedError.name = 'RateLimitError';
        throw enhancedError;
      }
      
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      // Clear the Firebase token specifically
      localStorage.removeItem('firebaseToken');
      // Clear any other local storage or session storage
      localStorage.clear();
      sessionStorage.clear();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const getIdToken = async (): Promise<string | null> => {
    if (!user) return null;
    try {
      return await user.getIdToken();
    } catch (error) {
      console.error('Get ID token error:', error);
      return null;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signInWithGoogle,
    logout,
    getIdToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
