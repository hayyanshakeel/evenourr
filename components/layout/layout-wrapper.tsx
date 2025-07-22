// components/layout/layout-wrapper.tsx
'use client';

import { Navbar } from 'components/layout/navbar';
import { WelcomeToast } from 'components/welcome-toast';
import { CartProvider } from 'components/cart/cart-context';
import { usePathname } from 'next/navigation';
import { ReactNode, Suspense } from 'react';
import { Toaster } from 'sonner';

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminPath = pathname.startsWith('/dashboard');

  // If we are in the admin dashboard, don't show the storefront navbar or cart
  if (isAdminPath) {
    return <>{children}</>;
  }

  // Otherwise, show the full storefront layout
  return (
    <CartProvider>
      <Suspense>
        <Navbar />
      </Suspense>
      <main>
        {children}
        <Toaster closeButton />
        <WelcomeToast />
      </main>
    </CartProvider>
  );
}