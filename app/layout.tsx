'use client';

import { GeistSans } from 'geist/font/sans';
import { LayoutWrapper } from '@/components/layout/layout-wrapper';
import { ReactNode } from 'react';
import './globals.css';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/dashboard');

  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="bg-neutral-50 text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">
        {isAdminPage ? children : <LayoutWrapper>{children}</LayoutWrapper>}
      </body>
    </html>
  );
}