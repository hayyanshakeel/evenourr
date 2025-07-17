import { Inter } from 'next/font/google';
import { ReactNode, Suspense } from 'react';

import { CartProvider } from '@/components/cart/cart-context';
import Footer from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { getMenu } from '@/lib/shopify';
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
  const menu = await getMenu('next-js-frontend-header-menu');

  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-white text-black selection:bg-teal-300 dark:bg-black dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">
        <CartProvider>
          <Navbar menu={menu} />
          <Suspense>
            <main>{children}</main>
          </Suspense>
          <Suspense>
            <Footer menu={menu} />
          </Suspense>
        </CartProvider>
      </body>
    </html>
  );
}