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
import { getCookie, setCookie, deleteCookie } from 'cookies-next';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
}

// This context manages the Firebase authentication state
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Attempt to get the token from cookies on initial load
    const initialToken = getCookie('firebaseToken');
    if (typeof initialToken === 'string') {
      setToken(initialToken);
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const idToken = await firebaseUser.getIdToken(true); // Force refresh
          setToken(idToken);
          // Store token in an HttpOnly cookie for security
          setCookie('firebaseToken', idToken, {
            // httpOnly: true, // Cannot be set from client-side script
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 1 week
          });
          console.log('✅ Firebase token stored in cookie');
        } catch (error) {
          console.error("Error getting ID token:", error);
          setToken(null);
          deleteCookie('firebaseToken');
        }
      } else {
        setUser(null);
        setToken(null);
        // Clear the token from cookies on sign out
        deleteCookie('firebaseToken');
        console.log('🔥 Firebase token cleared from cookie');
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
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
      deleteCookie('firebaseToken');
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
