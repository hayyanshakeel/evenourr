'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute';
import {
  Search,
  Bell,
  Settings,
  Home,
  ShoppingBag,
  Users,
  BarChart3,
  Package,
  Tag,
  MessageSquare,
  FileText,
  ChevronDown,
  Calendar,
  TrendingUp,
  CheckCircle,
  X,
  Globe,
  Store,
  Sparkles,
  Layers,
  RotateCcw,
  Eye,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  // Completely exclude login pages from admin layout
  if (pathname === '/hatsadmin/login' || pathname.includes('(login)')) {
    return <>{children}</>;
  }

  const sidebarItems = [
    { icon: Home, label: "Dashboard", url: "/hatsadmin/dashboard" },
    { icon: ShoppingBag, label: "Orders", url: "/hatsadmin/dashboard/orders" },
    { icon: Package, label: "Products", url: "/hatsadmin/dashboard/products" },
    { icon: Tag, label: "Categories", url: "/hatsadmin/dashboard/products/categories" },
    { icon: Users, label: "Customers", url: "/hatsadmin/dashboard/customers" },
    { icon: Package, label: "Inventory", url: "/hatsadmin/dashboard/inventory" },
    { icon: Layers, label: "Collections", url: "/hatsadmin/dashboard/collections" },
    { icon: Tag, label: "Coupons", url: "/hatsadmin/dashboard/coupons" },
    { icon: RotateCcw, label: "Returns", url: "/hatsadmin/dashboard/returns" },
    { icon: BarChart3, label: "Analytics", url: "/hatsadmin/analytics" },
    { icon: Eye, label: "Live Tracking", url: "/hatsadmin/tracking" },
    { icon: MessageSquare, label: "Behavioral", url: "/hatsadmin/dashboard/behavioral" },
    { icon: FileText, label: "CMS", url: "/cms?url=/", targetBlank: true as const },
    { icon: Settings, label: "Settings", url: "/hatsadmin/dashboard/settings" },
  ]

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <header className="bg-black text-white px-6 py-4 border-b border-slate-700/50 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight">Dashboard</span>
              </div>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  placeholder="Search anything..."
                  className="pl-12 pr-16 py-3 bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 rounded-xl backdrop-blur-sm"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm font-medium bg-slate-700/50 px-2 py-1 rounded-md">
                  ⌘K
                </div>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-xl"
              >
                <Settings className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-xl relative"
              >
                <Bell className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900"></div>
              </Button>
              <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 rounded-xl shadow-lg shadow-blue-500/25">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold">EVENOUR</span>
              </div>
            </div>
          </div>
        </header>

        <div className="flex">
          <aside className="w-56 bg-white/80 backdrop-blur-xl border-r border-slate-200/50 min-h-screen shadow-xl">
            <nav className="p-4">
              <ul className="space-y-2">
                {sidebarItems.map((item, index) => {
                  const isActive = pathname === item.url || (pathname?.startsWith(item.url) && item.url !== '/hatsadmin/dashboard');
                  return (
                    <li key={index}>
                      {item.targetBlank ? (
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                          <Button
                            variant={"ghost"}
                            className={`w-full justify-start gap-3 px-4 py-3 h-auto text-sm font-medium transition-all duration-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 hover:shadow-md border border-transparent hover:border-slate-200 rounded-xl`}
                          >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                          </Button>
                        </a>
                      ) : (
                        <Link href={item.url}>
                          <Button
                            variant={isActive ? "default" : "ghost"}
                            className={`w-full justify-start gap-3 px-4 py-3 h-auto text-sm font-medium transition-all duration-200 ${
                              isActive
                                ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-emerald-700"
                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 hover:shadow-md border border-transparent hover:border-slate-200"
                            } rounded-xl`}
                          >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                          </Button>
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>

              <div className="mt-8 pt-6 border-t border-slate-200/50">
                <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Sales channels
                </div>
                <ul className="space-y-2 mt-3">
                  <li>
                    <Link href="/">
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 px-4 py-3 h-auto text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200 hover:shadow-md border border-transparent hover:border-slate-200 rounded-xl"
                      >
                        <Store className="w-5 h-5" />
                        Online Store
                      </Button>
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200/50">
                <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Apps</div>
              </div>
            </nav>
          </aside>

          <main className="flex-1 p-8 space-y-8">
            {children}
          </main>
        </div>
      </div>
    </AdminProtectedRoute>
  );
}