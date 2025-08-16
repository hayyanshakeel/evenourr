'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  HiHome as HiOutlineHome,
  HiShoppingBag as HiOutlineShoppingBag,
  HiFolder as HiOutlineFolder,
  HiCircleStack as HiOutlineCircleStack,
  HiArchiveBox as HiOutlineArchiveBox,
  HiUserGroup as HiOutlineUserGroup,
  HiTicket as HiOutlineTicket,
  HiCog6Tooth as HiOutlineCog6Tooth,
  HiXMark as HiOutlineXMark,
  HiChevronRight as HiOutlineChevronRight,
  HiCube as HiOutlineCube,
  HiArrowRightOnRectangle as HiOutlineArrowRightOnRectangle,
  HiChartBarSquare as HiOutlineChartBarSquare
} from 'react-icons/hi2';
import { useState } from 'react';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const navigationItems = [
  { href: '/hatsadmin/dashboard', label: 'Dashboard', icon: HiOutlineHome },
  { href: '/hatsadmin/analytics', label: 'Analytics', icon: HiOutlineChartBarSquare },
  { href: '/hatsadmin/dashboard/orders', label: 'Orders', icon: HiOutlineArchiveBox },
  {
    href: '/hatsadmin/dashboard/products',
    label: 'Products',
    icon: HiOutlineCube,
    subItems: [
      { href: '/hatsadmin/dashboard/products', label: 'All Products' },
      { href: '/hatsadmin/dashboard/inventory', label: 'Inventory' },
      { href: '/hatsadmin/dashboard/collections', label: 'Collections' },
      { href: '/hatsadmin/dashboard/products/categories', label: 'Categories' },
    ]
  },
  { href: '/hatsadmin/dashboard/customers', label: 'Customers', icon: HiOutlineUserGroup },
  { href: '/hatsadmin/dashboard/coupons', label: 'Coupons', icon: HiOutlineTicket },
  { href: '/hatsadmin/dashboard/settings', label: 'Settings', icon: HiOutlineCog6Tooth }
];

export default function Nav({ isNavOpen, setIsNavOpen }: { isNavOpen: boolean, setIsNavOpen: (open: boolean) => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState<string[]>(['Products']);

  const toggleExpanded = (label: string) => {
    setExpandedItems(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const handleSignOut = () => {
    // Clear any auth tokens/session data
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    
    // Redirect to login or home page
    router.push('/');
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
          <HiOutlineXMark className="h-6 w-6" />
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
                    <HiOutlineChevronRight 
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

      {/* Sign Out Button */}
      <div className="px-4 pb-4 border-t border-gray-200">
        <button
          onClick={handleSignOut}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <HiOutlineArrowRightOnRectangle className="mr-3 h-5 w-5 flex-shrink-0" />
          Sign out
        </button>
      </div>
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
