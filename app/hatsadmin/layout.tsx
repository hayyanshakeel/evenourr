'use client';

import { ReactNode, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute';
import { ResponsiveSidebar, MobileHeader } from "@/components/admin/responsive-sidebar";
import './admin-styles.css';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    // Initialize state based on screen size
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Completely exclude login pages from admin layout
  if (pathname === '/hatsadmin/login' || pathname.includes('(login)')) {
    return <>{children}</>;
  }

  // Get page title from pathname
  const getPageTitle = (path: string) => {
    const segments = path.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    if (lastSegment === 'dashboard') return 'Dashboard';
    return lastSegment ? lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1) : 'Admin';
  };

  if (!mounted) {
    return (
      <div className="h-screen w-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <AdminProtectedRoute>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen" data-admin-panel="true">
        <div className="flex h-screen w-full">
          {/* Responsive Sidebar */}
          <ResponsiveSidebar
            isOpen={sidebarOpen}
            setIsOpen={setSidebarOpen}
            isCollapsed={false}
            setIsCollapsed={() => {}}
          />
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
            {/* Mobile Header */}
            <MobileHeader 
              onMenuClick={() => setSidebarOpen(true)}
              title={getPageTitle(pathname)}
            />
            
            {/* Page Content */}
            <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
              <div className="w-full h-full p-4 lg:p-6 xl:p-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </AdminProtectedRoute>
  );
}