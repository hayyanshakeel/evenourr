'use client';

import {
  ArchiveBoxIcon, HomeIcon, ShoppingBagIcon, UserGroupIcon, TicketIcon, Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { href: '/dashboard/products', label: 'Products', icon: ShoppingBagIcon },
  { href: '/dashboard/orders', label: 'Orders', icon: ArchiveBoxIcon },
  { href: '/dashboard/customers', label: 'Customers', icon: UserGroupIcon },
  { href: '/dashboard/coupons', label: 'Coupons', icon: TicketIcon },
  { href: '/dashboard/settings', label: 'Settings', icon: Cog6ToothIcon }
];

interface NavProps {
  isNavOpen: boolean;
  setIsNavOpen: (isOpen: boolean) => void;
}

const NavContent = () => {
  const pathname = usePathname();
  return (
    <>
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
                  'bg-gray-100 text-gray-900': pathname.startsWith(item.href),
                  'text-gray-600 hover:bg-gray-50 hover:text-gray-900': !pathname.startsWith(item.href)
                }
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default function Nav({ isNavOpen, setIsNavOpen }: NavProps) {
  return (
    <>
      {/* Mobile Nav */}
      <Transition show={isNavOpen} as={Fragment}>
        <Dialog onClose={() => setIsNavOpen(false)} className="relative z-40 md:hidden">
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel as="nav" className="relative flex w-64 flex-col bg-white">
                <NavContent />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Desktop Nav */}
      <nav className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col md:border-r md:border-gray-200 md:bg-white">
        <NavContent />
      </nav>
    </>
  );
}