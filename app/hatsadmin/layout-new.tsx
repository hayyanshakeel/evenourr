'use client';

import { ReactNode, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { cloudflareAuth } from '@/lib/cloudflare-admin-auth';
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

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      if (pathname === '/hatsadmin/login') {
        setLoading(false);
        return;
      }

      try {
        const token = cloudflareAuth.getToken();
        if (!token) {
          router.push('/hatsadmin/login');
          return;
        }

        const validation = await cloudflareAuth.validateToken();
        if (validation.valid && validation.user) {
          setIsAuthenticated(true);
          setUser(validation.user);
          console.log('✅ Admin authenticated via Cloudflare:', {
            user: validation.user.username,
            edge: validation.edge
          });
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
  }, [pathname, router]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await cloudflareAuth.logout();
      console.log('✅ Admin logged out successfully');
      router.push('/hatsadmin/login');
    } catch (error) {
      console.error('❌ Logout error:', error);
      router.push('/hatsadmin/login');
    }
  };

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

  // Login page (no authentication required)
  if (pathname === '/hatsadmin/login') {
    return <>{children}</>;
  }

  // Authenticated admin panel
  if (!isAuthenticated) {
    return null; // Will redirect to login
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
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 z-50 h-full w-64 transform bg-white/80 backdrop-blur-xl border-r border-gray-200/50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo Section */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200/50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Store className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">HatsAdmin</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.url || 
                (item.url !== '/hatsadmin/dashboard' && pathname.startsWith(item.url));
              
              const content = (
                <div className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200/50 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}>
                  <item.icon className={`w-5 h-5 mr-3 ${
                    isActive ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  {item.label}
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </div>
              );

              if ('targetBlank' in item && item.targetBlank) {
                return (
                  <a
                    key={item.url}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    {content}
                  </a>
                );
              }

              return (
                <Link
                  key={item.url}
                  href={item.url}
                  className="block"
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Section */}
        {user && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-lg p-3 border border-gray-200/50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.username?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.username || 'Admin'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.email || 'admin@evenour.in'}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Navigation */}
        <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>

            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search..."
                  className="pl-9 w-64 bg-gray-50/50 border-gray-200/50"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
              <Bell className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Globe className="w-4 h-4 text-green-500" />
              <span className="hidden sm:inline">Edge Auth Active</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
