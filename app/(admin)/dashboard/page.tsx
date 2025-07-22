'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/admin/header';
import StatsCard from '@/components/admin/stats-card';
import {
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  CubeIcon,
  TicketIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface DashboardStats {
  overview: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    totalProducts: number;
    totalCustomers: number;
    pendingOrders: number;
    activeCoupons: number;
  };
  growth: {
    revenueGrowth: string;
    orderGrowth: string;
  };
  topProducts: Array<{
    productId: number;
    title: string;
    totalSold: number;
    revenue: number;
  }>;
  recentOrders: Array<{
    id: number;
    orderNumber: string;
    customerEmail: string;
    total: number;
    status: string;
    createdAt: string;
  }>;
  revenueByDay: Array<{
    date: string;
    revenue: number;
    orderCount: number;
  }>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');

  useEffect(() => {
    fetchDashboardStats();
  }, [period]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/dashboard/stats?period=${period}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <Header title="Dashboard" />
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={stats ? formatCurrency(stats.overview.totalRevenue) : '-'}
          change={stats ? parseFloat(stats.growth.revenueGrowth) : undefined}
          changeLabel="vs previous period"
          icon={CurrencyDollarIcon}
          trend="up"
          loading={loading}
        />
        <StatsCard
          title="Total Orders"
          value={stats?.overview.totalOrders || 0}
          change={stats ? parseFloat(stats.growth.orderGrowth) : undefined}
          changeLabel="vs previous period"
          icon={ShoppingCartIcon}
          trend="up"
          loading={loading}
        />
        <StatsCard
          title="Average Order Value"
          value={stats ? formatCurrency(stats.overview.avgOrderValue) : '-'}
          icon={CurrencyDollarIcon}
          loading={loading}
        />
        <StatsCard
          title="Total Customers"
          value={stats?.overview.totalCustomers || 0}
          icon={UserGroupIcon}
          loading={loading}
        />
      </div>

      {/* Secondary Stats */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <StatsCard
          title="Active Products"
          value={stats?.overview.totalProducts || 0}
          icon={CubeIcon}
          loading={loading}
        />
        <StatsCard
          title="Pending Orders"
          value={stats?.overview.pendingOrders || 0}
          icon={ClockIcon}
          loading={loading}
        />
        <StatsCard
          title="Active Coupons"
          value={stats?.overview.activeCoupons || 0}
          icon={TicketIcon}
          loading={loading}
        />
      </div>

      {/* Top Products and Recent Orders */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Products */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">Top Products</h3>
          <div className="mt-4">
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 animate-pulse rounded bg-gray-200" />
                ))}
              </div>
            ) : stats?.topProducts.length ? (
              <div className="space-y-3">
                {stats.topProducts.map((product) => (
                  <div key={product.productId} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{product.title}</p>
                      <p className="text-sm text-gray-500">{product.totalSold} sold</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(product.revenue)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No products sold yet</p>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
          <div className="mt-4">
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 animate-pulse rounded bg-gray-200" />
                ))}
              </div>
            ) : stats?.recentOrders.length ? (
              <div className="space-y-3">
                {stats.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{order.orderNumber}</p>
                      <p className="text-sm text-gray-500">{order.customerEmail}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(order.total)}
                      </p>
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No orders yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
