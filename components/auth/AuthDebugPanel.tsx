'use client';

import { useAuth } from '@/components/auth/AuthContext';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export default function AuthDebugPanel() {
  const authContext = useAuth();
  const adminAuth = useAdminAuth();

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs font-mono shadow-xl border border-gray-700 max-w-md z-50">
      <div className="mb-2 font-bold text-yellow-400">🔐 Auth Debug</div>
      
      <div className="space-y-1">
        <div><strong>AuthContext:</strong></div>
        <div>• Loading: {authContext.loading ? '⏳' : '✅'}</div>
        <div>• User: {authContext.user ? `✅ ${authContext.user.email}` : '❌ None'}</div>
        
        <div className="mt-2"><strong>AdminAuth:</strong></div>
        <div>• Ready: {adminAuth.isReady ? '✅' : '⏳'}</div>
        <div>• Authenticated: {adminAuth.isAuthenticated ? '✅' : '❌'}</div>
        <div>• Token: {adminAuth.token ? `✅ ${adminAuth.token.substring(0, 20)}...` : '❌ None'}</div>
        <div>• User: {adminAuth.user ? `✅ ${adminAuth.user.email}` : '❌ None'}</div>
      </div>
      
      {!authContext.loading && !authContext.user && (
        <div className="mt-3 p-2 bg-red-900/50 rounded border border-red-500">
          <div className="text-red-300 font-semibold">⚠️ Not Logged In</div>
          <a 
            href="/hatsadmin/login" 
            className="text-blue-300 underline hover:text-blue-100"
          >
            → Go to Login
          </a>
        </div>
      )}
    </div>
  );
}
