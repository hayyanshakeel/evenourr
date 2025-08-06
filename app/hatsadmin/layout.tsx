'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import './admin-styles.css';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  // Completely exclude login pages from admin layout
  if (pathname === '/hatsadmin/login' || pathname.includes('(login)')) {
    return <>{children}</>;
  }

  return (
    <AdminProtectedRoute>
      <SidebarProvider>
        <div className="bg-gray-200 dark:bg-gray-900 h-screen w-screen" data-admin-panel="true">
          <div className="flex h-full w-full admin-panel">
            {/* Fixed sidebar, always visible */}
            <aside className="admin-sidebar-container">
              {/* Remove SidebarProvider and useSidebar logic from AdminSidebar */}
              <AdminSidebar />
            </aside>
            <main className="admin-main-content admin-scrollbar">
              <div className="w-full h-full px-4 py-4 md:px-8 md:py-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </AdminProtectedRoute>
  );
}