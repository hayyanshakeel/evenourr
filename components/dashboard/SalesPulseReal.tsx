"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch';
import { useSettings } from '@/hooks/useSettings';
import { formatCurrency } from '@/lib/currencies';

interface SalesMetrics {
  revenue: number;
  previousRevenue: number;
  orders: number;
  previousOrders: number;
  averageOrderValue: number;
  previousAOV: number;
  growthRate: number;
  dailyGrowth: number;
}

export default function SalesPulseReal() {
  const [metrics, setMetrics] = useState<SalesMetrics>({
    revenue: 0,
    previousRevenue: 0,
    orders: 0,
    previousOrders: 0,
    averageOrderValue: 0,
    previousAOV: 0,
    growthRate: 0,
    dailyGrowth: 0
  });

  const [loading, setLoading] = useState(true);
  const { authenticatedFetch, isAuthenticated } = useAuthenticatedFetch();
  const { currency } = useSettings();

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await authenticatedFetch('/api/analytics/sales?timeframe=30d');
        if (response.ok) {
          const data = await response.json();
          setMetrics(data.metrics);
        }
      } catch (error) {
        console.error('Error fetching sales data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchSalesData();
      
      // Refresh data every 5 minutes
      const interval = setInterval(fetchSalesData, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -2 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
            <p className="text-xs text-gray-400">Last 30 days</p>
          </div>
        </div>
        
        <motion.div
          className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
            metrics.growthRate >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {metrics.growthRate >= 0 ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          <span>{formatPercentage(metrics.growthRate)}</span>
        </motion.div>
      </div>

      {/* Main Metric */}
      <div className="mb-4">
        <motion.div
          className="text-3xl font-bold text-gray-900"
          key={metrics.revenue}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {formatCurrency(metrics.revenue, currency)}
        </motion.div>
        <p className="text-sm text-gray-500 mt-1">
          vs {formatCurrency(metrics.previousRevenue, currency)} previous period
        </p>
      </div>

      {/* Additional Metrics */}
      <div className="space-y-3 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Orders</span>
          <div className="text-right">
            <span className="text-sm font-semibold text-gray-900">
              {metrics.orders.toLocaleString()}
            </span>
            <div className={`text-xs ${
              metrics.orders >= metrics.previousOrders ? 'text-green-600' : 'text-red-600'
            }`}>
              {metrics.orders >= metrics.previousOrders ? '+' : ''}
              {(metrics.orders - metrics.previousOrders).toLocaleString()} orders
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Avg Order Value</span>
          <div className="text-right">
            <span className="text-sm font-semibold text-gray-900">
              {formatCurrency(metrics.averageOrderValue, currency)}
            </span>
            <div className={`text-xs ${
              metrics.averageOrderValue >= metrics.previousAOV ? 'text-green-600' : 'text-red-600'
            }`}>
              {metrics.averageOrderValue >= metrics.previousAOV ? '+' : ''}
              {formatCurrency(metrics.averageOrderValue - metrics.previousAOV, currency)}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
