'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthContext';

export default function AuthTestPage() {
  const { user, loading } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [authTest, setAuthTest] = useState<any>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('firebaseToken');
    setToken(storedToken);
  }, []);

  const testAuth = async () => {
    const storedToken = localStorage.getItem('firebaseToken');
    
    try {
      const response = await fetch('/api/admin/test-auth', {
        headers: {
          'Authorization': `Bearer ${storedToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      setAuthTest({ response: response.status, data });
    } catch (error) {
      setAuthTest({ error: error.message });
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Authentication Debug</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">Auth Context State:</h2>
          <div>Loading: {loading ? 'Yes' : 'No'}</div>
          <div>User: {user ? user.email : 'Not logged in'}</div>
          <div>User ID: {user ? user.uid : 'N/A'}</div>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">Local Storage Token:</h2>
          <div>Token present: {token ? 'Yes' : 'No'}</div>
          <div>Token preview: {token ? token.substring(0, 50) + '...' : 'N/A'}</div>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">API Test:</h2>
          <button 
            onClick={testAuth}
            className="bg-blue-500 text-white px-4 py-2 rounded mb-2"
          >
            Test API Auth
          </button>
          {authTest && (
            <div className="mt-2">
              <pre className="text-sm bg-white p-2 rounded">
                {JSON.stringify(authTest, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="bg-yellow-100 p-4 rounded">
          <h2 className="font-semibold mb-2">Instructions:</h2>
          <ol className="list-decimal list-inside space-y-1">
            <li>If not logged in, go to <a href="/hatsadmin/login" className="text-blue-600 underline">/hatsadmin/login</a></li>
            <li>Use admin credentials: admin@evenour.co or evenour.in@gmail.com</li>
            <li>After login, return here and test API auth</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
