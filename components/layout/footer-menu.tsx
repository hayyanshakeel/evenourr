'use client';

import { Menu } from '@/lib/shopify/types';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Fragment } from 'react';

export default function FooterMenu({ menu }: { menu: Menu[] }) {
  const pathname = usePathname();

  return (
    <nav>
      <ul>
        {menu.map((item: Menu) => {
          const active = pathname === item.path;
          return (
            <li key={item.title}>
              <Link
                href={item.path}
                className={`block p-2 text-lg underline-offset-4 hover:text-black hover:underline md:inline-block md:text-sm dark:hover:text-neutral-300 ${
                  active ? 'text-black dark:text-neutral-300' : ''
                }`}
              >
                {item.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}