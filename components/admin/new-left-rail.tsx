"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type NavItem = { label: string; href: string };

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/hatsadmin/dashboard' },
  { label: 'Orders', href: '/hatsadmin/dashboard/orders' },
  { label: 'Products', href: '/hatsadmin/dashboard/products' },
  { label: 'Categories', href: '/hatsadmin/dashboard/products/categories' },
  { label: 'Collections', href: '/hatsadmin/dashboard/collections' },
  { label: 'Inventory', href: '/hatsadmin/dashboard/inventory' },
  { label: 'Customers', href: '/hatsadmin/dashboard/customers' },
  { label: 'Returns & RMA', href: '/hatsadmin/dashboard/returns' },
  { label: 'Coupons', href: '/hatsadmin/dashboard/coupons' },
  { label: 'Analytics', href: '/hatsadmin/analytics' },
  { label: 'Settings', href: '/hatsadmin/dashboard/settings' },
];

export function NewLeftRail() {
  const pathname = usePathname();
  return (
    <aside className="w-44 bg-[#e1e1e1] text-black flex flex-col items-stretch pt-4 gap-3 rounded-tr-[36px]">
      {NAV_ITEMS.map((item, idx) => {
        const active = pathname?.startsWith(item.href);
        return (
          <Link key={idx} href={item.href} className="mx-3">
            <div
              className={cn(
                'relative h-9 rounded-[8px] bg-[#bdbdbd] transition-colors pl-10 pr-3 flex items-center text-[13px] font-medium truncate',
                'after:content-[""] after:absolute after:left-0 after:top-0 after:bottom-0 after:w-8 after:rounded-l-[8px] after:bg-[#adadad]',
                active && 'bg-white text-black shadow-sm after:bg-[#86efac]'
              )}
              title={item.label}
            >
              {item.label}
            </div>
          </Link>
        );
      })}
      <div className="mt-auto mx-3 mb-4 h-24 rounded-t-[28px] bg-[#3f3f3f]"/>
    </aside>
  );
}


