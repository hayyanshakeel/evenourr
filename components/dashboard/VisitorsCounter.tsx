"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Eye, Users, UserPlus, TrendingUp, TrendingDown } from "lucide-react";

interface VisitorMetrics {
  totalVisitors: number;
  uniqueVisitors: number;
  newVisitors: number;
  returningVisitors: number;
  averageSessionDuration: string;
  bounceRate: number;
  pageViews: number;
  trends: {
    visitors: { value: number; isPositive: boolean };
    sessionDuration: { value: number; isPositive: boolean };
    bounceRate: { value: number; isPositive: boolean };
  };
}

export function VisitorsCounter() {
  const [metrics, setMetrics] = useState<VisitorMetrics>({
    totalVisitors: 1242,
    uniqueVisitors: 1087,
    newVisitors: 342,
    returningVisitors: 745,
    averageSessionDuration: "2m 34s",
    bounceRate: 34.7,
    pageViews: 3456,
    trends: {
      visitors: { value: 15.2, isPositive: true },
      sessionDuration: { value: 8.4, isPositive: true },
      bounceRate: { value: -12.3, isPositive: true },
    }
  });

  const [liveCount, setLiveCount] = useState(23);

  // Simulate real-time visitor updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        totalVisitors: prev.totalVisitors + Math.floor(Math.random() * 3),
        pageViews: prev.pageViews + Math.floor(Math.random() * 5),
        uniqueVisitors: prev.uniqueVisitors + Math.floor(Math.random() * 2),
      }));

      setLiveCount(prev => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        return Math.max(0, prev + change);
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 h-[400px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-50 rounded-lg">
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Website Traffic</h3>
            <p className="text-sm text-gray-500">Real-time visitor analytics</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700">{liveCount} online</span>
        </div>
      </div>

      {/* Live Counter */}
      <div className="text-center mb-6">
        <motion.div
          key={metrics.totalVisitors}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="space-y-2"
        >
          <p className="text-3xl font-bold text-gray-900">
            {metrics.totalVisitors.toLocaleString()}
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm">
            <div className={`flex items-center space-x-1 ${metrics.trends.visitors.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {metrics.trends.visitors.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="font-medium">{metrics.trends.visitors.value}%</span>
            </div>
            <span className="text-gray-500">vs yesterday</span>
          </div>
        </motion.div>
      </div>

      {/* Visitor Breakdown */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-gray-600">Unique Visitors</p>
          <p className="text-xl font-bold text-blue-600">{metrics.uniqueVisitors.toLocaleString()}</p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-sm font-medium text-gray-600">Page Views</p>
          <p className="text-xl font-bold text-green-600">{metrics.pageViews.toLocaleString()}</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">New Visitors</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-bold text-gray-900">{metrics.newVisitors}</span>
            <span className="text-xs text-gray-500">({((metrics.newVisitors / metrics.totalVisitors) * 100).toFixed(1)}%)</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Returning Visitors</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-bold text-gray-900">{metrics.returningVisitors}</span>
            <span className="text-xs text-gray-500">({((metrics.returningVisitors / metrics.totalVisitors) * 100).toFixed(1)}%)</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Avg Session</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-bold text-gray-900">{metrics.averageSessionDuration}</span>
            <div className={`flex items-center space-x-1 text-xs ${metrics.trends.sessionDuration.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {metrics.trends.sessionDuration.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{metrics.trends.sessionDuration.value}%</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Bounce Rate</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-bold text-gray-900">{metrics.bounceRate}%</span>
            <div className={`flex items-center space-x-1 text-xs ${metrics.trends.bounceRate.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {metrics.trends.bounceRate.isPositive ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
              <span>{Math.abs(metrics.trends.bounceRate.value)}%</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
