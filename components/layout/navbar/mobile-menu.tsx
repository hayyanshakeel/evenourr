"use client";

import { Menu } from '@/lib/shopify/types';
import Link from 'next/link';

interface MobileMenuProps {
  menu: Menu[];
  onClose: () => void;
}

export default function MobileMenu({ menu, onClose }: MobileMenuProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white p-4 dark:bg-black">
      <button
        aria-label="Close menu"
        className="mb-4 self-end text-xl font-bold"
        onClick={onClose}
      >
        ×
      </button>
      <ul className="flex flex-col gap-4 text-lg">
        {menu.map((item) => (
          <li key={item.title}>
            <Link
              href={item.path}
              className="block text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white"
              onClick={onClose}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
