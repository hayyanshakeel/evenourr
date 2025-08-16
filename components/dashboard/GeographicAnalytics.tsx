"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { MapPin, Globe, TrendingUp, Users, DollarSign } from "lucide-react";
import { useSettings } from '@/hooks/useSettings';
import { formatCurrency } from '@/lib/currencies';

interface GeographicData {
  country: string;
  countryCode: string;
  revenue: number;
  orders: number;
  visitors: number;
  conversionRate: number;
  averageOrderValue: number;
  growth: number;
}

export function GeographicAnalytics() {
  const [geoData, setGeoData] = useState<GeographicData[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'orders' | 'visitors'>('revenue');
  const { currency } = useSettings();

  useEffect(() => {
    // Simulate geographic data
    const mockData: GeographicData[] = [
      { country: "United States", countryCode: "US", revenue: 1250000, orders: 15680, visitors: 125000, conversionRate: 12.5, averageOrderValue: 79.7, growth: 15.2 },
      { country: "United Kingdom", countryCode: "GB", revenue: 890000, orders: 11200, visitors: 89000, conversionRate: 12.6, averageOrderValue: 79.5, growth: 8.7 },
      { country: "Germany", countryCode: "DE", revenue: 675000, orders: 8500, visitors: 67500, conversionRate: 12.6, averageOrderValue: 79.4, growth: 12.3 },
      { country: "Canada", countryCode: "CA", revenue: 445000, orders: 5600, visitors: 44500, conversionRate: 12.6, averageOrderValue: 79.5, growth: 18.9 },
      { country: "Australia", countryCode: "AU", revenue: 320000, orders: 4000, visitors: 32000, conversionRate: 12.5, averageOrderValue: 80.0, growth: 22.1 },
      { country: "France", countryCode: "FR", revenue: 280000, orders: 3500, visitors: 28000, conversionRate: 12.5, averageOrderValue: 80.0, growth: 9.8 },
      { country: "Japan", countryCode: "JP", revenue: 265000, orders: 3300, visitors: 26500, conversionRate: 12.5, averageOrderValue: 80.3, growth: 14.6 },
      { country: "Netherlands", countryCode: "NL", revenue: 180000, orders: 2250, visitors: 18000, conversionRate: 12.5, averageOrderValue: 80.0, growth: 16.7 },
    ];
    setGeoData(mockData);
  }, []);

  const getMetricValue = (data: GeographicData) => {
    switch (selectedMetric) {
      case 'revenue': return data.revenue;
      case 'orders': return data.orders;
      case 'visitors': return data.visitors;
      default: return data.revenue;
    }
  };

  const getMetricLabel = () => {
    switch (selectedMetric) {
      case 'revenue': return 'Revenue';
      case 'orders': return 'Orders';
      case 'visitors': return 'Visitors';
      default: return 'Revenue';
    }
  };

  const formatValue = (value: number) => {
    switch (selectedMetric) {
      case 'revenue': return `${formatCurrency(value / 1000, currency)}K`;
      case 'orders': return value.toLocaleString();
      case 'visitors': return `${(value / 1000).toFixed(0)}K`;
      default: return value.toString();
    }
  };

  const maxValue = Math.max(...geoData.map(getMetricValue));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Globe className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Geographic Analytics</h3>
            <p className="text-sm text-gray-500">Revenue and performance by country</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {(['revenue', 'orders', 'visitors'] as const).map((metric) => (
            <button
              key={metric}
              onClick={() => setSelectedMetric(metric)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedMetric === metric
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {metric.charAt(0).toUpperCase() + metric.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {geoData.map((country, index) => {
          const value = getMetricValue(country);
          const percentage = (value / maxValue) * 100;
          
          return (
            <motion.div
              key={country.countryCode}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center space-x-4 p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
            >
              <div className="flex items-center space-x-3 min-w-[200px]">
                <div className="w-8 h-6 bg-gray-200 rounded-sm flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">{country.countryCode}</span>
                </div>
                <span className="font-medium text-gray-900">{country.country}</span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-900">
                    {formatValue(value)}
                  </span>
                  <div className={`flex items-center space-x-1 ${
                    country.growth >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendingUp className="w-3 h-3" />
                    <span className="text-xs font-medium">{country.growth > 0 ? '+' : ''}{country.growth}%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
              </div>
              
              <div className="flex space-x-4 text-xs text-gray-500 min-w-[200px]">
                <div className="text-center">
                  <div className="font-medium text-gray-900">{country.conversionRate}%</div>
                  <div>Conv. Rate</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-900">{formatCurrency(country.averageOrderValue, currency)}</div>
                  <div>AOV</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <MapPin className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-600">Countries</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{geoData.length}</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Users className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-600">Total Visitors</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {(geoData.reduce((sum, country) => sum + country.visitors, 0) / 1000).toFixed(0)}K
          </div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <DollarSign className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-600">Global Revenue</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            ${(geoData.reduce((sum, country) => sum + country.revenue, 0) / 1000000).toFixed(1)}M
          </div>
        </div>
      </div>
    </motion.div>
  );
}
