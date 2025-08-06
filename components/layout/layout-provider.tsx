'use client';

import { LayoutWrapper } from '@/components/layout/layout-wrapper';
import { AuthProvider } from '@/components/auth/AuthContext';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface LayoutProviderProps {
  children: ReactNode;
}

export function LayoutProvider({ children }: LayoutProviderProps) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/hatsadmin');

  return (
    <AuthProvider>
      {isAdminPage ? children : <LayoutWrapper>{children}</LayoutWrapper>}
    </AuthProvider>
  );
}
