'use client';

import { useState, useEffect } from 'react';
import { Users, TrendingUp, Eye, UserCheck, Globe, Smartphone } from 'lucide-react';
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch';

interface VisitorData {
  current: {
    totalVisitors: number;
    previousVisitors: number;
    visitorGrowth: number;
    uniqueVisitors: number;
    pageViews: number;
    avgSessionDuration: number;
    bounceRate: number;
    conversionRate: number;
  };
  sources: Array<{
    source: string;
    visitors: number;
    percentage: number;
  }>;
  devices: Array<{
    device: string;
    visitors: number;
    percentage: number;
  }>;
  popularPages: Array<{
    page: string;
    views: number;
    uniqueViews: number;
  }>;
  timeframe: string;
}

export default function VisitorsCounterReal() {
  const [data, setData] = useState<VisitorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState('30d');
  const { authenticatedFetch, isAuthenticated } = useAuthenticatedFetch();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await authenticatedFetch(`/api/analytics/visitors?timeframe=${timeframe}`);
      if (!response.ok) {
        throw new Error('Failed to fetch visitor analytics');
      }
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
      // Refresh every 5 minutes
      const interval = setInterval(fetchData, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [timeframe, isAuthenticated]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
        <div className="text-red-600">
          Error loading visitor analytics: {error}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="text-gray-500">No visitor data available</div>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Visitor Analytics</h3>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Visitors</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(data.current.totalVisitors)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className={`h-4 w-4 mr-1 ${data.current.visitorGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            <span className={`text-sm font-medium ${data.current.visitorGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.current.visitorGrowth >= 0 ? '+' : ''}{data.current.visitorGrowth.toFixed(1)}%
            </span>
            <span className="text-sm text-gray-500 ml-2">vs previous period</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unique Visitors</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(data.current.uniqueVisitors)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              {((data.current.uniqueVisitors / data.current.totalVisitors) * 100).toFixed(1)}% of total visitors
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Page Views</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(data.current.pageViews)}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Eye className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              {(data.current.pageViews / data.current.totalVisitors).toFixed(1)} pages per visitor
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{data.current.conversionRate.toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Avg session: {formatDuration(data.current.avgSessionDuration)}
            </p>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Sources */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h4>
          <div className="space-y-3">
            {data.sources.map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 bg-gray-100 rounded-lg mr-3">
                    <Globe className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 capitalize">{source.source}</p>
                    <p className="text-xs text-gray-500">{source.percentage.toFixed(1)}% of traffic</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">{formatNumber(source.visitors)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Device Types */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Device Types</h4>
          <div className="space-y-3">
            {data.devices.map((device, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 bg-gray-100 rounded-lg mr-3">
                    <Smartphone className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 capitalize">{device.device}</p>
                    <p className="text-xs text-gray-500">{device.percentage.toFixed(1)}% of visitors</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">{formatNumber(device.visitors)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Pages */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Popular Pages</h4>
          <div className="space-y-3">
            {data.popularPages.map((page, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{page.page}</p>
                  <p className="text-xs text-gray-500">{formatNumber(page.uniqueViews)} unique views</p>
                </div>
                <span className="text-sm font-medium text-gray-900 ml-2">{formatNumber(page.views)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{formatDuration(data.current.avgSessionDuration)}</p>
            <p className="text-sm text-gray-600 mt-1">Average Session Duration</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-red-600">{data.current.bounceRate.toFixed(1)}%</p>
            <p className="text-sm text-gray-600 mt-1">Bounce Rate</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{data.current.conversionRate.toFixed(2)}%</p>
            <p className="text-sm text-gray-600 mt-1">Conversion Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
}
