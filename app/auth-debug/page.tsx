'use client';

import { useEffect, useState } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export default function AuthTestPage() {
  const { makeAuthenticatedRequest, isReady, isAuthenticated, token, user } = useAdminAuth();
  const [testResults, setTestResults] = useState<any[]>([]);

  useEffect(() => {
    const runTests = async () => {
      const results: any[] = [];
      
      // Test 1: Check auth state
      results.push({
        test: 'Auth State',
        result: {
          isReady,
          isAuthenticated, 
          hasToken: !!token,
          tokenLength: token?.length || 0,
          user: user ? { email: user.email, uid: user.uid } : null
        }
      });

      // Test 2: Try debug endpoint
      try {
        const debugResponse = await fetch('/api/debug/auth');
        const debugData = await debugResponse.json();
        results.push({
          test: 'Debug API (no auth)',
          result: debugData
        });
      } catch (e) {
        results.push({
          test: 'Debug API (no auth)',
          result: { error: String(e) }
        });
      }

      // Test 3: Try authenticated request if ready
      if (isReady && isAuthenticated) {
        try {
          const authResponse = await makeAuthenticatedRequest('/api/admin/orders/stats');
          const authData = await authResponse.json();
          results.push({
            test: 'Authenticated API',
            result: { status: authResponse.status, data: authData }
          });
        } catch (e) {
          results.push({
            test: 'Authenticated API',
            result: { error: String(e) }
          });
        }
      }

      setTestResults(results);
    };

    runTests();
  }, [isReady, isAuthenticated, token]);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Authentication Test Results</h1>
      
      <div className="space-y-4">
        {testResults.map((test, index) => (
          <div key={index} className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">{test.test}</h3>
            <pre className="bg-gray-100 p-3 rounded overflow-auto text-sm">
              {JSON.stringify(test.result, null, 2)}
            </pre>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded">
        <h3 className="font-semibold mb-2">Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1">
          <li>Check if you're authenticated (isAuthenticated should be true)</li>
          <li>If not authenticated, go to <a href="/hatsadmin/login" className="text-blue-600 underline">/hatsadmin/login</a> to sign in</li>
          <li>Make sure you're accessing the correct port: <span className="font-mono">localhost:3001</span></li>
          <li>Check that the Firebase token is being sent correctly</li>
        </ol>
      </div>
    </div>
  );
}
