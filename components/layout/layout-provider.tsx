'use client';

import { LayoutWrapper } from '@/components/layout/layout-wrapper';
import { AuthProvider } from '@/components/auth/AuthContext';
import { BehaviorTrackingProvider, ErrorTracker } from '@/components/tracking/BehaviorTracking';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Toaster } from 'sonner';

interface LayoutProviderProps {
  children: ReactNode;
}

export function LayoutProvider({ children }: LayoutProviderProps) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/hatsadmin');

  return (
    <AuthProvider>
      <BehaviorTrackingProvider>
        <ErrorTracker />
        {isAdminPage ? children : <LayoutWrapper>{children}</LayoutWrapper>}
        <Toaster position="top-right" richColors />
      </BehaviorTrackingProvider>
    </AuthProvider>
  );
}
