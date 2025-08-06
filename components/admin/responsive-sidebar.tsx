"use client"

import { useEffect, useState } from "react"
import {
  BarChart3,
  Box,
  FileText,
  Globe,
  Home,
  Package,
  Settings,
  ShoppingCart,
  Tag,
  Truck,
  Users,
  Zap,
  RotateCcw,
  Megaphone,
  DollarSign,
  Shield,
  Layers,
  Percent,
  Menu,
  X
} from "lucide-react"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface SidebarData {
  pendingOrders: number;
  lowStockCount: number;
}

interface ResponsiveSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export function ResponsiveSidebar({ 
  isOpen, 
  setIsOpen, 
  isCollapsed, 
  setIsCollapsed 
}: ResponsiveSidebarProps) {
  const pathname = usePathname()
  const [sidebarData, setSidebarData] = useState<SidebarData>({ pendingOrders: 0, lowStockCount: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        // Fetch pending orders count
        const ordersResponse = await fetch('/api/admin/orders/stats')
        const ordersData = await ordersResponse.json()
        
        // Fetch low stock count
        const inventoryResponse = await fetch('/api/admin/inventory/stats')
        const inventoryData = await inventoryResponse.json()
        
        setSidebarData({
          pendingOrders: ordersData.pending || 0,
          lowStockCount: inventoryData.lowStock || 0,
        })
      } catch (error) {
        console.error('Failed to fetch sidebar data:', error)
      }
    }

    if (mounted) {
      fetchSidebarData()
      // Refresh every 30 seconds
      const interval = setInterval(fetchSidebarData, 30000)
      return () => clearInterval(interval)
    }
  }, [mounted])

  const navigationItems = [
    {
      title: "Core Operations",
      items: [
        { title: "Dashboard", url: "/hatsadmin/dashboard", icon: Home },
        { 
          title: "Orders", 
          url: "/hatsadmin/dashboard/orders", 
          icon: ShoppingCart, 
          badge: sidebarData.pendingOrders > 0 ? sidebarData.pendingOrders.toString() : undefined 
        },
        { title: "Products", url: "/hatsadmin/dashboard/products", icon: Package },
        { title: "Categories", url: "/hatsadmin/dashboard/products/categories", icon: Tag },
        { title: "Collections", url: "/hatsadmin/dashboard/collections", icon: Layers },
        { 
          title: "Inventory", 
          url: "/hatsadmin/dashboard/inventory", 
          icon: Box, 
          badge: sidebarData.lowStockCount > 0 ? "Low Stock" : undefined 
        },
      ],
    },
    {
      title: "Customer Management",
      items: [
        { title: "Customers", url: "/hatsadmin/dashboard/customers", icon: Users },
        { title: "Returns & RMA", url: "/hatsadmin/dashboard/returns", icon: RotateCcw },
      ],
    },
    {
      title: "Marketing & Promotions",
      items: [
        { title: "Marketing", url: "/hatsadmin/dashboard/marketing", icon: Megaphone },
        { title: "Coupons", url: "/hatsadmin/dashboard/coupons", icon: Percent },
      ],
    },
    {
      title: "Growth & Analytics",
      items: [
        { title: "Analytics", url: "/hatsadmin/dashboard/analytics", icon: BarChart3 },
        { title: "Reports", url: "/hatsadmin/dashboard/reports", icon: FileText },
      ],
    },
    {
      title: "Operations",
      items: [
        { title: "Shipping", url: "/hatsadmin/dashboard/shipping", icon: Truck },
        { title: "Finance", url: "/hatsadmin/dashboard/finance", icon: DollarSign },
        { title: "CMS", url: "/hatsadmin/dashboard/cms", icon: Globe },
      ],
    },
    {
      title: "Administration",
      items: [
        { title: "Settings", url: "/hatsadmin/dashboard/settings", icon: Settings },
        { title: "Admin Users", url: "/hatsadmin/dashboard/admin-users", icon: Shield },
      ],
    },
  ]

  if (!mounted) {
    return null
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <nav className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out",
        // Mobile styles
        "lg:relative lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
        // Desktop styles - always fixed width, no collapse
        "lg:w-64",
        // Mobile width
        "w-64"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-4 py-4 bg-white dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 border border-blue-200 dark:border-blue-800 flex-shrink-0">
              <Zap className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex flex-col space-y-0.5">
              <span className="text-base font-semibold text-gray-900 dark:text-gray-100 tracking-tight">Commerce Pro</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Enterprise Dashboard</span>
            </div>
          </div>
          
          {/* Mobile close button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-3 py-5 bg-white dark:bg-gray-900">
          {navigationItems.map((group) => (
            <div key={group.title} className="mb-8">
              <div className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 px-2 py-2 mb-4 uppercase tracking-wider">
                {group.title}
              </div>
              <ul className="space-y-2">
                {group.items.map((item) => {
                  const isActive = pathname === item.url
                  return (
                    <li key={item.title}>
                      <Link 
                        href={item.url} 
                        className={cn(
                          "flex items-center gap-3 px-3 py-3 w-full rounded-lg transition-all duration-200 group",
                          isActive 
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300" 
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                        )}
                        onClick={() => {
                          // Close mobile menu when navigating
                          if (window.innerWidth < 1024) {
                            setIsOpen(false)
                          }
                        }}
                      >
                        <item.icon className={cn(
                          "h-5 w-5 flex-shrink-0 transition-colors stroke-2",
                          isActive 
                            ? "text-blue-600 dark:text-blue-400" 
                            : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                        )} />
                        
                        <span className="font-medium text-[13px] truncate">{item.title}</span>
                        {item.badge && (
                          <Badge variant="secondary" className={cn(
                            "ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full",
                            isActive 
                              ? "bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300" 
                              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                          )}>
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-800 px-4 py-4 bg-white dark:bg-gray-900">
          <div className="flex items-center gap-2 text-xs">
            <div className="h-3 w-3 rounded-full bg-green-500 shadow-sm flex-shrink-0 animate-pulse" />
            <span className="text-gray-600 dark:text-gray-400 font-medium">System Online</span>
          </div>
        </div>
      </nav>
    </>
  )
}

interface MobileHeaderProps {
  onMenuClick: () => void;
  title: string;
}

export function MobileHeader({ onMenuClick, title }: MobileHeaderProps) {
  return (
    <div className="lg:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center gap-3">
      <Button
        variant="ghost"
        size="sm"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>
      <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
        {title}
      </h1>
    </div>
  )
}
