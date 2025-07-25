// Clean, isolated layout for user login
'use client';
import { ReactNode } from 'react';
export default function UserLoginLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-blue-50">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
