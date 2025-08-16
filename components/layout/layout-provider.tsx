'use client';

import { LayoutWrapper } from '@/components/layout/layout-wrapper';
import { AuthProvider } from '@/components/auth/AuthContext';
import { BehaviorTrackingProvider, ErrorTracker } from '@/components/tracking/BehaviorTracking';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { Toaster } from '@/components/ui/sonner';

interface LayoutProviderProps {
  children: ReactNode;
}

export function LayoutProvider({ children }: LayoutProviderProps) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/hatsadmin');
  const isCmsPage = pathname.startsWith('/cms');

  return (
    <AuthProvider>
      <ThemeProvider>
        <BehaviorTrackingProvider>
          <ErrorTracker />
          {/*
            IMPORTANT: Do NOT wrap CMS with LayoutWrapper.
            LayoutWrapper injects Navbar and CartProvider, which initialize and open the cart drawer.
            The CMS must be fully isolated with its own layout and no cart/nav.
          */}
          {isAdminPage || isCmsPage ? (
            children
          ) : (
            <LayoutWrapper>{children}</LayoutWrapper>
          )}
          {!isCmsPage && <Toaster position="top-right" richColors />}
        </BehaviorTrackingProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
