'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { useSettings } from '@/hooks/useSettings';
import {
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  CubeIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  UserPlusIcon,
  ChartBarIcon,
  GlobeAltIcon,
  RefreshIcon,
  MegaphoneIcon,
  DocumentArrowUpIcon
} from '@heroicons/react/24/outline';

interface Stats {
  totalRevenue: number;
  totalSales: number;
  totalCustomers: number;
  totalProducts: number;
  ordersToday: number;
  activeCustomers: number;
  productsSold: number;
  recentOrders: any[];
  growthData: {
    revenue: { value: number; isPositive: boolean };
    orders: { value: number; isPositive: boolean };
    customers: { value: number; isPositive: boolean };
    products: { value: number; isPositive: boolean };
  };
}

interface RecentActivity {
  id: string;
  type: 'order' | 'product' | 'customer' | 'payment';
  title: string;
  description: string;
  time: string;
  amount?: string;
}

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  growth, 
  comparison,
  bgColor = "bg-white",
  iconBg = "bg-blue-50",
  iconColor = "text-blue-600"
}: any) => (
  <div className={`rounded-xl ${bgColor} p-6 shadow-sm border border-gray-100`}>
    <div className="flex items-center justify-between">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
        {growth && (
          <div className="flex items-center text-sm">
            {growth.isPositive ? (
              <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={`font-medium ${growth.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {growth.isPositive ? '+' : ''}{growth.value}%
            </span>
            <span className="text-gray-500 ml-1">{comparison}</span>
          </div>
        )}
      </div>
      <div className={`rounded-full ${iconBg} p-3 flex-shrink-0`}>
        <Icon className={`h-6 w-6 ${iconColor}`} />
      </div>
    </div>
  </div>
);

const ActivityItem = ({ activity }: { activity: RecentActivity }) => {
  const getIcon = () => {
    switch (activity.type) {
      case 'order':
        return <ShoppingCartIcon className="h-5 w-5 text-green-600" />;
      case 'product':
        return <CubeIcon className="h-5 w-5 text-blue-600" />;
      case 'customer':
        return <UserPlusIcon className="h-5 w-5 text-purple-600" />;
      case 'payment':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getBgColor = () => {
    switch (activity.type) {
      case 'order':
        return 'bg-green-50';
      case 'product':
        return 'bg-blue-50';
      case 'customer':
        return 'bg-purple-50';
      case 'payment':
        return 'bg-red-50';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <div className="flex items-start space-x-3 p-4 hover:bg-gray-50 rounded-lg transition-colors">
      <div className={`rounded-full p-2 ${getBgColor()}`}>
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
        <p className="text-sm text-gray-500">{activity.description}</p>
        <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
      </div>
      {activity.amount && (
        <div className="text-sm font-semibold text-gray-900">
          {activity.amount}
        </div>
      )}
    </div>
  );
};

const QuickActionButton = ({ 
  icon: Icon, 
  title, 
  description, 
  onClick,
  color = "text-blue-600",
  bgColor = "bg-blue-50"
}: any) => (
  <button 
    onClick={onClick}
    className="flex items-center p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200 w-full text-left"
  >
    <div className={`rounded-lg p-3 ${bgColor} mr-4`}>
      <Icon className={`h-5 w-5 ${color}`} />
    </div>
    <div>
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  </button>
);

const DashboardPage = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currency } = useSettings();
  const { getIdToken } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Get Firebase ID token
        const token = await getIdToken();
        if (!token) {
          throw new Error('No authentication token available');
        }

        const response = await fetch('/api/hatsadmin/dashboard/stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch dashboard data');
        }
        const data = await response.json();
        setStats(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [getIdToken]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount);

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats?.totalRevenue ?? 0)}
          icon={CurrencyDollarIcon}
        />
        <StatCard title="Sales" value={`+${stats?.totalSales ?? 0}`} icon={ShoppingCartIcon} />
        <StatCard
          title="Customers"
          value={`+${stats?.totalCustomers ?? 0}`}
          icon={UserGroupIcon}
        />
      </div>

      {/* Recent Orders Table */}
      <div className="mt-8 rounded-lg border bg-white shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Order ID
                </th>
                <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Customer
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Total
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {stats?.recentOrders?.length ? (
                stats.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 sm:px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                        <div className="sm:hidden text-xs text-gray-500 mt-1">
                          {order.user?.name || 'Guest'}
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {order.user?.name || 'Guest'}
                    </td>
                    <td className="whitespace-nowrap px-4 sm:px-6 py-4 text-sm font-medium text-gray-900">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="whitespace-nowrap px-4 sm:px-6 py-4 text-sm">
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 sm:px-6 py-8 text-center text-sm text-gray-500">
                    No recent orders
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;