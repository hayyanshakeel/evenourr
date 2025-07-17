// app/layout.tsx

import { Inter } from 'next/font/google';
import { ReactNode, Suspense } from 'react';

import { CartProvider } from '@/components/cart/cart-context';
import Footer from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { getMenu } from '@/lib/shopify';
import { Menu } from '@/lib/shopify/types'; // Ensure Menu type is imported
import './globals.css';

const { TWITTER_CREATOR, TWITTER_SITE, SITE_NAME } = process.env;
const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://` + process.env.NEXT_PUBLIC_VERCEL_URL
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`
  },
  robots: {
    follow: true,
    index: true
  },
  ...(TWITTER_CREATOR &&
    TWITTER_SITE && {
      twitter: {
        card: 'summary_large_image',
        creator: TWITTER_CREATOR,
        site: TWITTER_SITE
      }
    })
};

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

export default async function RootLayout({ children }: { children: ReactNode }) {
  // Fetch both the header and footer menus in parallel on the server
  const [headerMenu, footerMenu] = await Promise.all([
    getMenu('next-js-frontend-header-menu'),
    getMenu('next-js-frontend-footer-menu') // Ensure you have a menu with this handle in Shopify
  ]);

  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#f9f8f8] text-black selection:bg-teal-300">
        <CartProvider>
          <Navbar menu={headerMenu} />
          <Suspense>
            <main>{children}</main>
          </Suspense>
          <Suspense>
            {/* Pass the fetched footerMenu data to the Footer component */}
            <Footer menu={footerMenu} />
          </Suspense>
        </CartProvider>
      </body>
    </html>
  );
}
