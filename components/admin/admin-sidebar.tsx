"use client"

import { useEffect, useState } from "react"
import { useAdminAuth } from "@/hooks/useAdminAuth"
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
} from "lucide-react"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { usePathname } from "next/navigation"

interface SidebarData {
  pendingOrders: number;
  lowStockCount: number;
}

export function AppSidebar() {
  const pathname = usePathname()
  const { makeAuthenticatedRequest, isReady, isAuthenticated, token } = useAdminAuth()
  const [sidebarData, setSidebarData] = useState<SidebarData>({ pendingOrders: 0, lowStockCount: 0 })

  useEffect(() => {
    let mounted = true;
    
    // Fetch sidebar data with proper error handling
    const fetchSidebarData = async () => {
      if (!isReady || !isAuthenticated || !mounted) return;
      
      try {
        // Fetch pending orders count
        const ordersResponse = await makeAuthenticatedRequest('/api/admin/orders/stats')
        const ordersData = ordersResponse.ok ? await ordersResponse.json() : {}
        
        // Fetch low stock count
        const inventoryResponse = await makeAuthenticatedRequest('/api/admin/inventory/stats')
        const inventoryData = inventoryResponse.ok ? await inventoryResponse.json() : {}
        
        if (mounted) {
          setSidebarData({
            pendingOrders: ordersData.pending || 0,
            lowStockCount: inventoryData.lowStock || 0,
          })
        }
      } catch (error) {
        if (mounted) {
          console.error('Error fetching sidebar data:', error)
        }
      }
    }

    // Only fetch when authenticated and ready
    if (isReady && isAuthenticated && mounted) {
      fetchSidebarData()
    }
    
    // Poll every 5 minutes only when authenticated
    const interval = setInterval(() => {
      if (isReady && isAuthenticated && mounted) {
        fetchSidebarData()
      }
    }, 300000) // 5 minutes
    
    return () => clearInterval(interval)
  }, [isReady, isAuthenticated])

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

  return (
    <nav className="admin-sidebar-static border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 h-full w-64 flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 px-4 py-5 bg-white dark:bg-gray-900 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-calm-blue border border-blue-200 dark:border-blue-800 flex-shrink-0">
          <Zap className="h-5 w-5 text-calm-blue" />
        </div>
        <div className="flex flex-col space-y-0.5">
          <span className="text-base font-semibold text-gray-900 dark:text-gray-100 tracking-tight">Commerce Pro</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Enterprise Dashboard</span>
        </div>
      </div>
      {/* Content */}
      <div className="px-3 py-5 bg-white dark:bg-gray-900 overflow-y-auto flex-1">
        {navigationItems.map((group) => (
          <div key={group.title} className="mb-10">
            <div className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 px-2 py-2 mb-4 uppercase tracking-wider">
              {group.title}
            </div>
            <ul className="space-y-3">
              {group.items.map((item) => {
                const isActive = pathname === item.url
                return (
                  <li key={item.title}>
                    <Link href={item.url} className={`flex items-center gap-3 px-3 py-3 w-full rounded-lg transition-all duration-200 ${isActive ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"}`}>
                      <item.icon className={`h-5 w-5 flex-shrink-0 transition-colors stroke-2 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`} />
                      <span className="font-medium text-[13px] truncate">{item.title}</span>
                      {item.badge && (
                        <Badge variant="secondary" className={`ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full ${isActive ? "bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}`}>{item.badge}</Badge>
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
  )
}

export { AppSidebar as AdminSidebar }
