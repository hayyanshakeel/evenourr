'use client';

import { ReactNode, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { secureAdminApi } from '@/lib/secure-admin-api';
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
  Menu,
  LogOut,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check authentication status - only on mount, not on every pathname change
  useEffect(() => {
    const checkAuth = async () => {
      // Skip auth check on login page
      if (pathname === '/hatsadmin/login') {
        setLoading(false);
        return;
      }

      try {
        const token = secureAdminApi.getToken();
        console.log('[Layout] Checking auth, token:', token ? 'present' : 'missing');
        
        if (!token) {
          console.log('[Layout] No token found, redirecting to login');
          router.push('/hatsadmin/login');
          return;
        }

        const validation = await secureAdminApi.validateToken();
        console.log('[Layout] Validation result:', validation);
        
        if (validation.valid && validation.user) {
          setIsAuthenticated(true);
          setUser(validation.user);
          console.log('✅ Admin authenticated:', validation.user);
        } else {
          console.log('❌ Invalid token, redirecting to login');
          router.push('/hatsadmin/login');
        }
      } catch (error) {
        console.error('❌ Auth check error:', error);
        router.push('/hatsadmin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []); // Remove pathname dependency to prevent re-checking on navigation

  // Handle logout
  const handleLogout = async () => {
    try {
      await secureAdminApi.logout();
      console.log('✅ Admin logged out successfully');
      router.push('/hatsadmin/login');
    } catch (error) {
      console.error('❌ Logout error:', error);
      router.push('/hatsadmin/login');
    }
  };

  // Login page (no authentication required)
  if (pathname === '/hatsadmin/login') {
    return <>{children}</>;
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Check if we have a token but waiting for validation
  const hasToken = secureAdminApi.getToken();
  
  // If not authenticated and no token, redirect to login
  if (!isAuthenticated && !hasToken) {
    console.log('[Layout] Not authenticated and no token, redirecting...');
    return null; // Will redirect to login
  }
  
  // If we have a token but still validating, show the content
  // (the validation will redirect if token is invalid)
  if (!isAuthenticated && hasToken) {
    console.log('[Layout] Has token but not yet validated, showing content...');
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 light">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <header className="bg-black text-white px-6 py-4 border-b border-slate-700/50 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          {/* Logo with mobile menu */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-xl p-2 -ml-2"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight">EVENOUR</span>
            </div>
          </div>

          {/* Search - Hidden on mobile, shown on desktop */}
          <div className="hidden lg:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
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
            <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 rounded-xl shadow-lg shadow-blue-500/25">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold">CLOUDFLARE</span>
            </div>
            
            {/* Logout button only */}
            {user && (
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-slate-300 hover:text-red-300 hover:bg-red-900/20 rounded-xl px-3"
              >
                <span className="hidden sm:inline text-sm mr-2">Logout</span>
                <LogOut className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-50 lg:z-auto w-64 lg:w-56 bg-white/80 backdrop-blur-xl border-r border-slate-200/50 min-h-screen shadow-xl transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          <nav className="p-4">
            {/* Close button for mobile */}
            <div className="flex justify-end mb-4 lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

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
                          onClick={() => setSidebarOpen(false)}
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
                          onClick={() => setSidebarOpen(false)}
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
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0 p-6 bg-gradient-to-br from-slate-50/50 to-white/50 backdrop-blur-sm">
          {children}
        </main>
      </div>
    </div>
  );
}
