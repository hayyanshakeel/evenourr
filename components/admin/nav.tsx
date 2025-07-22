'use client';

import {
  ArchiveBoxIcon,
  HomeIcon,
  ShoppingBagIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: HomeIcon },
  { href: '/admin/dashboard/products', label: 'Products', icon: ShoppingBagIcon },
  { href: '/admin/dashboard/orders', label: 'Orders', icon: ArchiveBoxIcon },
  { href: '/admin/dashboard/customers', label: 'Customers', icon: UserGroupIcon }
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="flex w-64 flex-col border-r border-gray-200 bg-white">
      <div className="p-4">
        <Link href="/" className="text-2xl font-bold text-gray-900">
          YourStore
        </Link>
      </div>
      <ul className="flex-1 space-y-2 p-4">
        {menuItems.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className={clsx(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                {
                  'bg-gray-100 text-gray-900': pathname === item.href,
                  'text-gray-600 hover:bg-gray-50 hover:text-gray-900': pathname !== item.href
                }
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
