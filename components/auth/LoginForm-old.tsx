'use client';

import { useState } from 'react';
import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';

interface LoginFormProps {
  redirectPath?: string;
  isAdminLogin?: boolean;
}

export default function LoginForm({ redirectPath = '/', isAdminLogin = false }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [storeName, setStoreName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting EVR authentication...');
      console.log('Email:', email);
      console.log('Is admin login:', isAdminLogin);
      
      // For admin login, check if email is authorized admin email
      if (isAdminLogin && email !== 'admin@evenour.co' && email !== 'evenour.in@gmail.com') {
        setError('Access denied. Admin credentials required.');
        setLoading(false);
        return;
      }
      
      await signIn(email, password);
      
      console.log('EVR Authentication successful, redirecting...');
      // Redirect based on login type
      if (isAdminLogin) {
        router.push('/hatsadmin/dashboard');
      } else {
        router.push(redirectPath);
      }
    } catch (error: any) {
      console.error('EVR Authentication error:', error);
      
      // Handle EVR authentication errors
      let errorMessage = 'Login failed';
      
      if (error.message?.includes('rate limit')) {
        errorMessage = 'Too many login attempts. Please wait 5-10 minutes before trying again.';
      } else if (error.message?.includes('network')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.message?.includes('user not found')) {
        errorMessage = 'No account found with this email address.';
      } else if (error.message?.includes('invalid credentials')) {
        errorMessage = isAdminLogin
          ? 'Invalid admin credentials. Check the email and password.'
          : 'Incorrect email or password.';
      } else if (error.message?.includes('invalid email')) {
        errorMessage = 'Invalid email address.';
      } else if (error.message?.includes('too many requests')) {
        errorMessage = 'Too many failed attempts. Please wait 5-10 minutes before trying again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!storeName.trim()) {
      setError('Store name is required');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      console.log('🏗️ Creating enterprise account...');
      
      const response = await fetch('/api/auth/enterprise-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          confirmPassword,
          storeName,
          ownerName: email.split('@')[0], // Use email prefix as default name
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Enterprise account created successfully');
        console.log('🗄️ Dedicated Turso database created for:', storeName);
        // Now sign in with the new credentials
        await signIn(email, password);
        router.push(redirectPath);
      } else {
        setError(result.error || 'Registration failed');
      }
      
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      setError('Failed to create enterprise account');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      // For now, redirect to enterprise registration instead of Google OAuth
      if (isAdminLogin) {
        setError('Admin accounts must use email/password authentication');
      } else {
        setIsRegistering(true);
      }
    } catch (error: any) {
      setError('Enterprise registration is required for new accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!storeName.trim()) {
      setError('Store name is required');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      console.log('🏗️ Creating enterprise account...');
      
      const response = await fetch('/api/auth/enterprise-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          confirmPassword,
          storeName,
          ownerName: email.split('@')[0], // Use email prefix as default name
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Enterprise account created successfully');
        // Now sign in with the new credentials
        await signIn(email, password);
        router.push(redirectPath);
      } else {
        setError(result.error || 'Registration failed');
      }
      
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      setError('Failed to create enterprise account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={isAdminLogin ? "space-y-6" : "min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"}>
      <div className={isAdminLogin ? "w-full" : "max-w-md w-full space-y-8"}>
        <div>
          <h2 className="text-center font-extrabold text-gray-900 text-2xl">
            {isAdminLogin 
              ? 'Admin Sign In' 
              : isRegistering 
                ? 'Create Enterprise Account' 
                : 'Sign In'
            }
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isAdminLogin 
              ? 'Access the admin dashboard'
              : isRegistering
                ? 'Get your own store with dedicated database'
                : 'Access your enterprise store'
            }
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={isRegistering ? handleRegistration : handleEmailLogin}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="rounded-md shadow-sm -space-y-px">
            {isRegistering && (
              <div>
                <label htmlFor="storeName" className="sr-only">
                  Store Name
                </label>
                <input
                  id="storeName"
                  name="storeName"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Store Name (e.g., MyAwesomeStore)"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${
                  isRegistering ? '' : 'rounded-t-md'
                }`}
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isRegistering ? "new-password" : "current-password"}
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${
                  isRegistering ? '' : 'rounded-b-md'
                }`}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {isRegistering && (
              <div>
                <label htmlFor="confirmPassword" className="sr-only">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading 
                ? (isRegistering ? 'Creating Account...' : 'Signing in...') 
                : (isRegistering ? 'Create Enterprise Account' : 'Sign in')
              }
            </button>
          </div>

          {!isAdminLogin && (
            <>
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-50 text-gray-500">
                      {isRegistering ? 'Already have an account?' : 'Need an enterprise account?'}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegistering(!isRegistering);
                      setError('');
                      setEmail('');
                      setPassword('');
                      setConfirmPassword('');
                      setStoreName('');
                    }}
                    disabled={loading}
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span>
                      {isRegistering ? 'Sign in to existing account' : 'Create new enterprise store'}
                    </span>
                  </button>
                </div>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
