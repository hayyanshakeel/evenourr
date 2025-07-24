// components/admin/nav.tsx

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  ShoppingBagIcon,
  FolderIcon, // NEW
  CircleStackIcon, // NEW
  ArchiveBoxIcon,
  UserGroupIcon,
  TicketIcon,
  Cog6ToothIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

// Define menu items with new additions
const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { href: '/dashboard/orders', label: 'Orders', icon: ArchiveBoxIcon },
  {
    href: '/dashboard/products',
    label: 'Products',
    icon: ShoppingBagIcon,
    // Add sub-navigation for better organization
    children: [
      { href: '/dashboard/products', label: 'All Products' },
      { href: '/dashboard/inventory', label: 'Inventory', icon: CircleStackIcon },
      { href: '/dashboard/collections', label: 'Collections', icon: FolderIcon },
    ]
  },
  { href: '/dashboard/customers', label: 'Customers', icon: UserGroupIcon },
  { href: '/dashboard/coupons', label: 'Coupons', icon: TicketIcon },
  { href: '/dashboard/settings', label: 'Settings', icon: Cog6ToothIcon }
];

export default function Nav({ isNavOpen, setIsNavOpen }: { isNavOpen: boolean, setIsNavOpen: (open: boolean) => void }) {
  const pathname = usePathname();

  // Sidebar content
  const navContent = (
    <nav className="flex flex-1 flex-col h-full">
      <ul role="list" className="flex flex-1 flex-col gap-y-7">
        <li>
          <ul role="list" className="-mx-2 space-y-1">
            {menuItems.map((item) => (
              <li key={item.label}>
                {!item.children ? (
                  <Link
                    href={item.href}
                    className={classNames(
                      pathname === item.href
                        ? 'bg-gray-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600',
                      'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                    )}
                    onClick={() => setIsNavOpen(false)}
                  >
                    <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                    {item.label}
                  </Link>
                ) : (
                  <div>
                    <div
                      className={classNames(
                        item.children.some((child) => pathname.startsWith(child.href)) ? 'bg-gray-50 text-blue-600' : 'text-gray-700',
                        'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                      )}
                    >
                      <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                      {item.label}
                    </div>
                    <ul className="mt-1 ml-2 pl-5 border-l border-gray-200">
                      {item.children.map((child) => (
                        <li key={child.label}>
                          <Link
                            href={child.href}
                            className={classNames(
                              pathname === child.href
                                ? 'text-blue-600'
                                : 'text-gray-500 hover:text-blue-600',
                              'block rounded-md py-2 pr-2 pl-4 text-sm leading-6'
                            )}
                            onClick={() => setIsNavOpen(false)}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:z-30 md:flex md:w-64 md:flex-col md:bg-white md:border-r md:shadow-sm">
        <div className="flex h-full flex-col p-4">{navContent}</div>
      </div>
      {/* Mobile sidebar */}
      {isNavOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black bg-opacity-30 transition-opacity md:hidden" onClick={() => setIsNavOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg flex flex-col p-4 transition-transform md:hidden">
            <button className="mb-4 self-end" onClick={() => setIsNavOpen(false)}>
              <XMarkIcon className="h-6 w-6 text-gray-600" />
            </button>
            {navContent}
          </div>
        </>
      )}
    </>
  );
}