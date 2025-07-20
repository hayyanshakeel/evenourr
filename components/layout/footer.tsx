import Link from 'next/link';
import FooterMenu from '@/components/layout/footer-menu';
import LogoSquare from '@/components/logo-square';
import { getMenu } from '@/lib/shopify';
import { Menu } from '@/lib/shopify/types';

const { COMPANY_NAME, SITE_NAME } = process.env;

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const menu = await getMenu('next-js-frontend-footer-menu');

  return (
    <footer className="text-sm text-neutral-500 dark:text-neutral-400">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 border-t border-neutral-200 px-6 py-12 text-sm dark:border-neutral-700 md:flex-row md:gap-12 md:px-4 min-[1320px]:px-0">
        <div>
          <Link className="flex items-center gap-2 text-black dark:text-white md:pt-1" href="/">
            <LogoSquare size="sm" />
            <span className="uppercase">{SITE_NAME}</span>
          </Link>
        </div>
        <FooterMenu menu={menu} />
      </div>
      <div className="border-t border-neutral-200 py-6 text-sm dark:border-neutral-700">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-1 px-4 md:flex-row md:gap-0 md:px-4 min-[1320px]:px-0">
          <p>
            &copy; {currentYear} {COMPANY_NAME}. All rights reserved.
          </p>
          <hr className="mx-4 hidden h-4 w-px border-l border-neutral-200 dark:border-neutral-500 md:inline-block" />
          <p>Designed in California</p>
          <p className="md:ml-auto">
            <a href="https://vercel.com" className="text-black dark:text-white">
              Crafted by ▲ Vercel
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}