"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ShoppingCart,
  Package,
  Users,
  Megaphone,
  Percent,
  FileText,
  Globe,
  BarChart3,
  ChevronRight,
} from "lucide-react";

type Item = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const MAIN_ITEMS: Item[] = [
  { label: "Home", href: "/hatsadmin/dashboard", icon: Home },
  { label: "Orders", href: "/hatsadmin/dashboard/orders", icon: ShoppingCart },
  { label: "Products", href: "/hatsadmin/dashboard/products", icon: Package },
  { label: "Customers", href: "/hatsadmin/dashboard/customers", icon: Users },
  { label: "Marketing", href: "/hatsadmin/dashboard/marketing", icon: Megaphone },
  { label: "Discounts", href: "/hatsadmin/dashboard/coupons", icon: Percent },
  { label: "Content", href: "/hatsadmin/dashboard/products", icon: FileText },
  { label: "Markets", href: "/hatsadmin/dashboard", icon: Globe },
  { label: "Analytics", href: "/hatsadmin/analytics", icon: BarChart3 },
];

export function ShopifySidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-[248px] bg-[#e9e9e9] text-black flex-col border-r border-[#dfdfdf]">
      <div className="px-2 pt-3 pb-2" />
      <nav className="flex-1 px-2 space-y-1">
        {MAIN_ITEMS.map((item) => {
          const active = pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="block">
              <div
                className={[
                  "flex items-center h-9 rounded-xl px-3 gap-3 text-[13px]",
                  active ? "bg-white shadow-sm" : "hover:bg-[#dedede]",
                ].join(" ")}
              >
                <Icon className="h-[14px] w-[14px] text-gray-800" />
                <span className="truncate">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pt-2 text-[12px] text-gray-600">Sales channels</div>
      <div className="px-2 py-1">
        <Link href="/">
          <div className="flex items-center justify-between h-8 rounded-xl px-3 text-[13px] hover:bg-[#dedede]">
            <div className="flex items-center gap-3">
              <span className="inline-block h-[14px] w-[14px] bg-gray-700 rounded-sm" />
              Online Store
            </div>
            <ChevronRight className="h-4 w-4 text-gray-500" />
          </div>
        </Link>
      </div>

      <div className="px-3 pt-2 text-[12px] text-gray-600">Apps</div>
      <div className="px-2 pb-4">
        <div className="flex items-center justify-between h-8 rounded-xl px-3 text-[13px] hover:bg-[#dedede] cursor-pointer">
          <div className="flex items-center gap-3">
            <span className="inline-block h-[14px] w-[14px] bg-gray-700 rounded-sm" />
            Apps
          </div>
          <ChevronRight className="h-4 w-4 text-gray-500" />
        </div>
      </div>
    </aside>
  );
}


