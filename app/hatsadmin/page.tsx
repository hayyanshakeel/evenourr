'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HatsAdminRoot() {
  const router = useRouter();

  useEffect(() => {
    // Always redirect to login page - no exceptions
    // The login page will handle the authentication flow
    router.replace('/hatsadmin/login');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
    </div>
  );
}
