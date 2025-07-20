"use client";

import { Menu } from '@/lib/shopify/types';
import Link from 'next/link';

interface MobileMenuProps {
  menu: Menu[];
}

export default function MobileMenu({ menu }: MobileMenuProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white p-4 dark:bg-black md:hidden">
      <button
        aria-label="Close menu"
        className="mb-4 self-end text-xl font-bold"
        onClick={() => {
          // Implement close menu logic here, e.g., toggle state or context
          console.log('Close menu clicked');
        }}
      >
        ×
      </button>
      <ul className="flex flex-col gap-4 text-lg">
        {menu.map((item) => (
          <li key={item.title}>
            <Link
              href={item.path}
              className="block text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white"
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
