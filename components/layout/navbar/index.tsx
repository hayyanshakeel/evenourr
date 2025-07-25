// File: components/layout/navbar/index.tsx

'use client'; // 1. Add this directive to make it a Client Component

import OpenCart from 'components/cart/open-cart';
import LogoSquare from 'components/logo-square';
import Link from 'next/link';
import { Suspense } from 'react';
import MobileMenu from './mobile-menu';
import Search from './search';
import dynamic from 'next/dynamic';

const { SITE_NAME } = process.env;

const CartModal = dynamic(() => import('components/cart/modal'), { ssr: false });

// 2. Remove the 'async' keyword from the function definition
export default function Navbar() {
  return (
    <nav className="relative flex items-center justify-between p-4 lg:px-6">
      <div className="block flex-none md:hidden">
        <Suspense fallback={null}>
          <MobileMenu menu={[]} />
        </Suspense>
      </div>
      <div className="flex w-full items-center">
        <div className="flex w-full md:w-1/3">
          <Link href="/" className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6">
            <LogoSquare />
            <div className="ml-2 flex-none text-sm font-medium uppercase md:hidden lg:block">
              {SITE_NAME}
            </div>
          </Link>
        </div>
        <div className="hidden justify-center md:flex md:w-1/3">
          <Suspense fallback={null}>
            <Search />
          </Suspense>
        </div>
        <div className="flex justify-end md:w-1/3">
          <Suspense fallback={<OpenCart />}>
            <OpenCart />
          </Suspense>
        </div>
      </div>
      
      <Suspense fallback={null}>
        <CartModal />
      </Suspense>
    </nav>
  );
}