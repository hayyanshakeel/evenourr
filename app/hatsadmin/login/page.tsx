'use client';

import LoginForm from '../../../components/auth/LoginForm';

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          {/* Removed duplicate heading. Heading now only in LoginForm. */}
          <LoginForm isAdminLogin={true} redirectPath="/hatsadmin/dashboard" />
        </div>
      </div>
    </div>
  );
}
