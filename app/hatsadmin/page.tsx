'use client';

import { useAuth } from '../../components/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HatsAdminRoot() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user && user.email === 'admin@evenour.co') {
        // User is authenticated as admin, redirect to dashboard
        router.replace('/hatsadmin/dashboard');
      } else {
        // Not authenticated or not admin, redirect to login
        router.replace('/hatsadmin/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
    </div>
  );
}
