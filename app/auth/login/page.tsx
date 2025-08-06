'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

function AuthLoginRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const callbackUrl = searchParams.get('callbackUrl');
    
    // If callback URL suggests admin route, redirect to admin login
    if (callbackUrl?.includes('hatsadmin') || callbackUrl?.includes('admin')) {
      router.replace('/hatsadmin/login');
    } else {
      // Otherwise redirect to user login
      router.replace('/userlogin');
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to login...</p>
      </div>
    </div>
  );
}

export default function AuthLoginRedirect() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <AuthLoginRedirectContent />
    </Suspense>
  );
}
