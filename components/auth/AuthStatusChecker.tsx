'use client';

import { useEffect, useState } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export default function AuthStatusChecker() {
  const { isReady, isAuthenticated, user, token } = useAdminAuth();
  const [authCheck, setAuthCheck] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (!isReady) return;

      try {
        const response = await fetch('/api/debug/auth');
        const debugData = await response.json();
        setAuthCheck(debugData);
      } catch (e) {
        setAuthCheck({ error: String(e) });
      }
    };

    checkAuth();
  }, [isReady]);

  if (!isReady) {
    return (
      <div className="fixed top-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded shadow-lg z-50">
        🔄 Checking authentication...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded shadow-lg z-50 max-w-md">
        <div className="font-semibold mb-1">❌ Not Authenticated</div>
        <div className="text-sm mb-2">You need to log in to access admin features.</div>
        <a
          href="/hatsadmin/login"
          className="inline-block bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
        >
          Login as Admin
        </a>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded shadow-lg z-50 max-w-md">
      <div className="font-semibold mb-1">✅ Authenticated</div>
      <div className="text-sm">
        User: {user?.email}<br/>
        Token: {token ? `${token.substring(0, 10)}...` : 'None'}
      </div>
      {authCheck && (
        <div className="text-xs mt-1 opacity-75">
          API: {authCheck.hasAuth ? '✅' : '❌'} Auth Header
        </div>
      )}
    </div>
  );
}