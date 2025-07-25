// Clean, isolated layout for admin login
'use client';
import { ReactNode } from 'react';
export default function AdminLoginLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
