// File: components/layout/layout-wrapper.tsx

'use client';

// This is the line we are fixing
import Navbar from 'components/layout/navbar'; 
import { WelcomeToast } from 'components/welcome-toast';
import { CartProvider } from 'components/cart/cart-context';
import { usePathname } from 'next/navigation';

export const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <CartProvider>
      {/* Hide the navbar on the admin login page */}
      {!pathname.includes('/hatsadmin/login') && <Navbar />}
      <div className="mx-auto max-w-screen-2xl px-4">
        <main>{children}</main>
      </div>
      <WelcomeToast />
    </CartProvider>
  );
};