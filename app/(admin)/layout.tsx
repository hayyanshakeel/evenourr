import Nav from '@/components/admin/nav';
import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-gray-50 text-gray-800">
      <Nav />
      <div className="flex-1 overflow-auto">
        <main className="p-6 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
