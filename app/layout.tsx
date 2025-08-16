import { GeistSans } from 'geist/font/sans';
import { LayoutProvider } from '@/components/layout/layout-provider';
import { ReactNode } from 'react';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'J7 Store - Professional E-commerce Platform',
    template: '%s | J7 Store'
  },
  description: 'Professional e-commerce platform with advanced admin features',
  keywords: ['ecommerce', 'store', 'admin', 'dashboard'],
  authors: [{ name: 'J7 Team' }],
  creator: 'J7 Team',
  publisher: 'J7 Store',
  icons: {
    icon: '/favicon.ico',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html 
      lang="en" 
      className={GeistSans.variable}
      suppressHydrationWarning={true}
    >
      <body 
        className="bg-transparent text-black dark:text-white selection:bg-teal-300 dark:selection:bg-pink-500 dark:selection:text-white"
        suppressHydrationWarning={true}
      >
        <LayoutProvider>{children}</LayoutProvider>
      </body>
    </html>
  );
}