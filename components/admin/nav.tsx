'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  ShoppingBagIcon,
  FolderIcon,
  CircleStackIcon,
  ArchiveBoxIcon,
  UserGroupIcon,
  TicketIcon,
  Cog6ToothIcon,
  XMarkIcon,
  ChevronRightIcon,
  CubeIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const navigationItems = [
  { href: '/hatsadmin/dashboard', label: 'Dashboard', icon: HomeIcon },
  { href: '/hatsadmin/dashboard/orders', label: 'Orders', icon: ArchiveBoxIcon },
  {
    href: '/hatsadmin/dashboard/products',
    label: 'Products',
    icon: CubeIcon,
    subItems: [
      { href: '/hatsadmin/dashboard/products', label: 'All Products' },
      { href: '/hatsadmin/dashboard/inventory', label: 'Inventory' },
      { href: '/hatsadmin/dashboard/collections', label: 'Collections' },
      { href: '/hatsadmin/dashboard/products/categories', label: 'Categories' },
    ]
  },
  { href: '/hatsadmin/dashboard/customers', label: 'Customers', icon: UserGroupIcon },
  { href: '/hatsadmin/dashboard/coupons', label: 'Coupons', icon: TicketIcon },
  { href: '/hatsadmin/dashboard/settings', label: 'Settings', icon: Cog6ToothIcon }
];

export default function Nav({ isNavOpen, setIsNavOpen }: { isNavOpen: boolean, setIsNavOpen: (open: boolean) => void }) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(['Products']);

  const toggleExpanded = (label: string) => {
    setExpandedItems(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const navContent = (
    <div className="flex h-full flex-col bg-white border-r border-gray-200">
      <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-900">Admin</h1>
        </div>
        <button
          type="button"
          className="md:hidden -m-2 p-2 text-gray-600 hover:text-gray-900"
          onClick={() => setIsNavOpen(false)}
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const isExpanded = expandedItems.includes(item.label);
          
          return (
            <div key={item.label}>
              {item.subItems ? (
                <>
                  <button
                    onClick={() => toggleExpanded(item.label)}
                    className={classNames(
                      'w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                      isActive
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <div className="flex items-center">
                      <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      {item.label}
                    </div>
                    <ChevronRightIcon 
                      className={classNames(
                        'h-4 w-4 transition-transform',
                        isExpanded ? 'rotate-90' : ''
                      )}
                    />
                  </button>
                  {isExpanded && (
                    <div className="mt-1 ml-8 space-y-1">
                      {item.subItems.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={classNames(
                            'block px-3 py-2 text-sm rounded-lg transition-colors',
                            pathname === child.href
                              ? 'bg-blue-50 text-blue-700 font-medium'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          )}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  className={classNames(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.label}
                </Link>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {isNavOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={() => setIsNavOpen(false)}
        />
      )}

      <div className="hidden md:fixed md:inset-y-0 md:z-50 md:flex md:w-64 md:flex-col">
        {navContent}
      </div>

      <div
        className={classNames(
          'fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:hidden',
          isNavOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {navContent}
      </div>
    </>
  );
}
