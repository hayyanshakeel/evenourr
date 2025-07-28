'use client';

import LoginForm from '../../../components/auth/LoginForm';

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Admin Sign In
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Access the admin dashboard
            </p>
          </div>
          <LoginForm isAdminLogin={true} redirectPath="/hatsadmin/dashboard" />
        </div>
      </div>
    </div>
  );
}
