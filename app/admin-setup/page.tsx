'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function AdminSetup() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const setupAdminUser = async () => {
    setLoading(true);
    setStatus('Setting up admin user...');

    try {
      const adminEmail = 'admin@evenour.co';
      const adminPassword = 'Hayyaan123@1';

      const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
      setStatus(`✅ Admin user created successfully! UID: ${userCredential.user.uid}`);
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setStatus('✅ Admin user already exists!');
      } else {
        setStatus(`❌ Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-6 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Admin Setup
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Create the admin user for the first time
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={setupAdminUser}
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Setting up...' : 'Setup Admin User'}
          </button>

          {status && (
            <div className={`p-4 rounded-md ${status.includes('✅') ? 'bg-green-100 text-green-700' : status.includes('❌') ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
              {status}
            </div>
          )}

          {status.includes('✅') && (
            <div className="mt-4 p-4 bg-gray-100 rounded-md">
              <p className="text-sm text-gray-700">
                <strong>Admin Credentials:</strong><br />
                Email: admin@evenour.co<br />
                Password: Hayyaan123@1<br />
                <br />
                <a href="/hatsadmin/login" className="text-indigo-600 hover:underline">
                  Go to Admin Login →
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
