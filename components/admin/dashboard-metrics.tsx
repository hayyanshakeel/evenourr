"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpIcon, ArrowDownIcon, DollarSign, ShoppingCart, Users, Package } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { useAdminAuth } from "@/hooks/useAdminAuth"
import { useSettings } from "@/hooks/useSettings"
import { formatCurrency } from "@/lib/currencies"
import { secureAdminApi } from '@/lib/secure-admin-api';

interface DashboardMetricsData {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenueChange: number;
  ordersChange: number;
  productsChange: number;
  customersChange: number;
  lowStockCount?: number;
  pendingOrdersCount?: number;
  recentOrders?: any[];
  topProducts?: any[];
}

export function DashboardMetrics() {
  const [metrics, setMetrics] = useState<DashboardMetricsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { makeAuthenticatedRequest, isReady, isAuthenticated } = useAdminAuth()
  const { currency } = useSettings()

  useEffect(() => {
    let isMounted = true

    const fetchMetrics = async () => {
      if (!isMounted) return

      try {
        console.log('[DashboardMetrics] Starting fetch, auth status:', {
          apiAuthenticated: secureAdminApi.isAuthenticated(),
          hasValidToken: secureAdminApi.hasValidToken(),
          isReady,
          hookAuthenticated: isAuthenticated
        });

        setError(null); // Clear any previous errors

        let metricsRes;
        metricsRes = await secureAdminApi.getDashboardMetrics();
        if (!metricsRes.success) {
          console.log('[DashboardMetrics] getDashboardMetrics failed, trying getDashboardStats');
          metricsRes = await secureAdminApi.getDashboardStats();
        }
        
        if (metricsRes.success) {
          setMetrics(metricsRes as any);
        } else {
          console.error('[DashboardMetrics] Both API calls failed:', metricsRes.error);
          setError(metricsRes.error || 'Failed to load dashboard metrics');
          setMetrics({ data: null } as any);
        }
      } catch (e) {
        console.error('[DashboardMetrics] Failed to load metrics via gateway', e);
        const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
        setError(`Network error: ${errorMessage}`);
        setMetrics({ data: null } as any);
      } finally {
        setLoading(false);
      }
    }

    // Always try to fetch, regardless of auth state for development
    fetchMetrics()

    return () => {
      isMounted = false
    }
  }, [isReady, isAuthenticated, makeAuthenticatedRequest])

  if (loading || !metrics) {
    return (
      <div className="grid gap-4 md:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="admin-card animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="grid gap-4 md:gap-6 lg:gap-8 grid-cols-1">
        <Card className="admin-card border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Dashboard Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error}</p>
            {error.includes('Authentication required') && (
              <p className="text-sm text-gray-600 mt-2">
                Please refresh the page and login again to access the admin dashboard.
              </p>
            )}
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Reload Page
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const metricCards = [
    {
      title: "Total Revenue",
      value: formatCurrency(metrics?.totalRevenue || 0, currency),
      change: `${(metrics?.revenueChange || 0) > 0 ? '+' : ''}${(metrics?.revenueChange || 0).toFixed(1)}%`,
      trend: (metrics?.revenueChange || 0) >= 0 ? "up" : "down",
      icon: DollarSign,
      description: "vs last month",
      color: "text-calm-green",
      bgColor: "bg-calm-green",
      borderColor: "border-green-200/50 dark:border-green-800/30",
    },
    {
      title: "Total Orders",
      value: (metrics?.totalOrders || 0).toLocaleString(),
      change: `${(metrics?.ordersChange || 0) > 0 ? '+' : ''}${(metrics?.ordersChange || 0).toFixed(1)}%`,
      trend: (metrics?.ordersChange || 0) >= 0 ? "up" : "down",
      icon: ShoppingCart,
      description: "vs last month",
      color: "text-calm-blue",
      bgColor: "bg-calm-blue",
      borderColor: "border-blue-200/50 dark:border-blue-800/30",
    },
    {
      title: "Total Customers",
      value: (metrics?.totalCustomers || 0).toLocaleString(),
      change: `${(metrics?.customersChange || 0) > 0 ? '+' : ''}${(metrics?.customersChange || 0).toFixed(1)}%`,
      trend: (metrics?.customersChange || 0) >= 0 ? "up" : "down",
      icon: Users,
      description: "vs last month",
      color: "text-calm-purple",
      bgColor: "bg-calm-purple",
      borderColor: "border-purple-200/50 dark:border-purple-800/30",
    },
    {
      title: "Total Products",
      value: (metrics?.totalProducts || 0).toLocaleString(),
      change: `${(metrics?.productsChange || 0) > 0 ? '+' : ''}${(metrics?.productsChange || 0).toFixed(1)}%`,
      trend: (metrics?.productsChange || 0) >= 0 ? "up" : "down",
      icon: Package,
      description: "vs last month",
      color: "text-calm-orange",
      bgColor: "bg-calm-orange",
      borderColor: "border-orange-200/50 dark:border-orange-800/30",
    },
  ]

  return (
    <div className="grid gap-4 md:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {metricCards.map((metric, index) => {
        const IconComponent = metric.icon
        const TrendIcon = metric.trend === "up" ? ArrowUpIcon : ArrowDownIcon
        const trendColor = metric.trend === "up" ? "text-green-600" : "text-red-600"
        
        return (
          <Card
            key={metric.title}
            className={cn(
              "admin-card relative overflow-hidden transition-all duration-300 hover:border-slate-300",
              metric.borderColor
            )}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                {metric.title}
              </CardTitle>
              <div className={cn("p-2 rounded-lg", metric.bgColor, "bg-opacity-10")}>
                <IconComponent className={cn("h-4 w-4", metric.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {metric.value}
              </div>
              <div className="flex items-center text-xs">
                <TrendIcon className={cn("h-3 w-3 mr-1", trendColor)} />
                <span className={trendColor}>{metric.change}</span>
                <span className="text-gray-500 ml-1">{metric.description}</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
