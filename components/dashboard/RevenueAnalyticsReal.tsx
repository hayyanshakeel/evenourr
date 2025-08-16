"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { TrendingUp, DollarSign, Package, Users, Calendar, Download } from "lucide-react";
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch';
import { useSettings } from '@/hooks/useSettings';
import { formatCurrency } from '@/lib/currencies';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface RevenueData {
  summary: {
    totalRevenue: number;
    recurringRevenue: number;
    recurringPercentage: number;
    totalOrders: number;
    arpu: number;
    averageOrderValue: number;
  };
  dailyData: Array<{
    date: string;
    revenue: number;
    orders: number;
    averageOrderValue: number;
  }>;
  topProducts: Array<{
    id: number;
    name: string;
    basePrice: number;
    totalRevenue: number;
    totalQuantity: number;
  }>;
  timeframe: string;
}

export default function RevenueAnalyticsReal() {
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const [loading, setLoading] = useState(true);
  const { authenticatedFetch, isAuthenticated } = useAuthenticatedFetch();
  const { currency } = useSettings();

  useEffect(() => {
    const fetchRevenueData = async () => {
      setLoading(true);
      try {
        const response = await authenticatedFetch(`/api/analytics/revenue?timeframe=${selectedTimeframe}`);
        if (response.ok) {
          const data = await response.json();
          setRevenueData(data);
        }
      } catch (error) {
        console.error('Error fetching revenue data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchRevenueData();
    }
  }, [selectedTimeframe, isAuthenticated]);

  if (loading || !revenueData) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const chartData = {
    labels: revenueData.dailyData.map(d => {
      const date = new Date(d.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'Revenue',
        data: revenueData.dailyData.map(d => d.revenue),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 3,
      },
      {
        label: 'Orders',
        data: revenueData.dailyData.map(d => d.orders * 10), // Scale for visibility
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: false,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 2,
        yAxisID: 'y1',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11
          }
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          callback: function(value: any) {
            return formatCurrency(value, currency);
          },
          font: {
            size: 11
          }
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function(value: any) {
            return Math.round(value / 10) + ' orders';
          },
          font: {
            size: 11
          }
        }
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Revenue Analytics</h3>
            <p className="text-sm text-gray-500">Comprehensive revenue performance tracking</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex space-x-1">
            {(['7d', '30d', '90d'] as const).map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTimeframe === timeframe
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {timeframe}
              </button>
            ))}
          </div>
          
          <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            <Download className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
          <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(revenueData.summary.totalRevenue, currency)}
          </div>
          <div className="text-sm text-gray-600">Total Revenue</div>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
          <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(revenueData.summary.recurringRevenue, currency)}
          </div>
          <div className="text-sm text-gray-600">Recurring Revenue</div>
          <div className="text-xs text-blue-500 mt-1">
            {revenueData.summary.recurringPercentage.toFixed(1)}% of total
          </div>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
          <Package className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-600">
            {revenueData.summary.totalOrders.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total Orders</div>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
          <Users className="w-8 h-8 text-orange-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-orange-600">
            {formatCurrency(revenueData.summary.arpu, currency)}
          </div>
          <div className="text-sm text-gray-600">ARPU</div>
          <div className="text-xs text-orange-500 mt-1">
            AOV: {formatCurrency(revenueData.summary.averageOrderValue, currency)}
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="mb-8">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Revenue Trend</h4>
        <div className="h-80">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Top Products */}
      {revenueData.topProducts.length > 0 && (
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-4">Top Performing Products</h4>
          <div className="space-y-3">
            {revenueData.topProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-green-600">#{index + 1}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500">
                      Base price: {formatCurrency(product.basePrice, currency)}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {formatCurrency(product.totalRevenue, currency)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {product.totalQuantity} units sold
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
