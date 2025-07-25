'use client';

import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function FirebaseTest() {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testFirebaseConnection = async () => {
    setLoading(true);
    setTestResult('Testing Firebase connection...');

    try {
      // Test 1: Check Firebase config
      console.log('Firebase Auth instance:', auth);
      console.log('Firebase App:', auth.app);
      console.log('Firebase Config:', auth.app.options);
      
      setTestResult(prev => prev + '\n✅ Firebase initialized successfully');

      // Test 2: Try to connect to Firebase Auth service
      try {
        // This will fail if there's a network issue
        await signInWithEmailAndPassword(auth, 'test@test.com', 'wrongpassword');
      } catch (error: any) {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
          setTestResult(prev => prev + '\n✅ Firebase Auth service is reachable');
        } else if (error.code === 'auth/network-request-failed') {
          setTestResult(prev => prev + '\n❌ Network request failed - Firebase unreachable');
          throw error;
        } else {
          setTestResult(prev => prev + `\n⚠️ Unexpected error: ${error.code}`);
        }
      }

      // Test 3: Try admin login
      try {
        await signInWithEmailAndPassword(auth, 'admin@evenour.co', 'Hayyaan123@1');
        setTestResult(prev => prev + '\n✅ Admin login successful!');
        
        // Sign out immediately
        await auth.signOut();
        setTestResult(prev => prev + '\n✅ Sign out successful');
        
      } catch (error: any) {
        setTestResult(prev => prev + `\n❌ Admin login failed: ${error.code} - ${error.message}`);
      }

    } catch (error: any) {
      console.error('Firebase test error:', error);
      setTestResult(prev => prev + `\n❌ Firebase connection failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setTestResult('');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Firebase Connection Test</h2>
      
      <div className="space-y-4">
        <button
          onClick={testFirebaseConnection}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Firebase Connection'}
        </button>

        <button
          onClick={clearResults}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 ml-2"
        >
          Clear Results
        </button>

        {testResult && (
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold mb-2">Test Results:</h3>
            <pre className="whitespace-pre-wrap text-sm">{testResult}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
