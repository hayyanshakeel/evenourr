import { redirect } from 'next/navigation';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Welcome to Evenour</h1>
          <p className="text-lg text-gray-600 mb-8">
            Secure E-commerce Platform with Firebase Authentication
          </p>
          
          <div className="space-y-4">
            <a
              href="/hatsadmin/login"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              🔐 Admin Login
            </a>
            
            <a
              href="/userlogin"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              👤 User Login
            </a>
            
            <a
              href="/api/products"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              📦 View Products (Public API)
            </a>
          </div>
        </div>
        
        <div className="mt-8 p-6 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Admin Credentials</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <div><strong>Email:</strong> admin@evenour.co</div>
            <div><strong>Password:</strong> Hayyaan123@1</div>
          </div>
        </div>
        
        <div className="mt-6 p-6 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Security Features</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>✅ Firebase Authentication</li>
            <li>✅ Role-based Access Control</li>
            <li>✅ Protected API Routes</li>
            <li>✅ Rate Limiting</li>
            <li>✅ CORS Protection</li>
            <li>✅ Security Headers</li>
            <li>✅ Input Validation</li>
          </ul>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Quick Access</h4>
          <div className="space-y-1 text-sm">
            <div><strong>Admin Dashboard:</strong> /hatsadmin/dashboard</div>
            <div><strong>User Dashboard:</strong> /user/dashboard</div>
            <div><strong>API Endpoints:</strong> /api/* (Protected)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
