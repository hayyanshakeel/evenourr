"use client";

import { motion } from "framer-motion";
import { 
  SalesPulse,
  VisitorsCounter, 
  OrdersHeatmap,
  RadialClockChart,
  ProductBubbleChart,
  AIPredictionChart,
  ConversionFunnel,
  CustomerInsights,
  MarketingAttribution,
  InventoryTracker,
  RevenueAnalytics,
  GeographicAnalytics,
  CohortAnalysis,
  RealTimeAnalytics,
  UserBehaviorAnalytics,
  AdvancedMarketingAttribution
} from "./index";
import { BarChart3, Calendar, Download, Filter, RefreshCw } from "lucide-react";

export function AnalyticsDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-[1900px] mx-auto space-y-8"
      >
        {/* Header with Controls */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center justify-between bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Enterprise Analytics
              </h1>
              <p className="text-gray-600 mt-1">
                Comprehensive business intelligence dashboard
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Live Indicator */}
            <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-700 text-sm font-medium">Live Data</span>
            </div>
            
            {/* Time Range Selector */}
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>Last 24 hours</option>
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>Last 12 months</option>
              </select>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <RefreshCw className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <Filter className="w-4 h-4 text-gray-600" />
              </button>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm flex items-center space-x-2 transition-colors">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Key Performance Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <SalesPulse />
          <VisitorsCounter />
          <OrdersHeatmap />
          <ConversionFunnel />
        </motion.div>

        {/* Revenue Analytics - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1"
        >
          <RevenueAnalytics />
        </motion.div>

        {/* Real-Time Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <RealTimeAnalytics />
        </motion.div>

        {/* Advanced Analytics Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className="lg:col-span-2">
            <RadialClockChart />
          </div>
          <ProductBubbleChart />
        </motion.div>

        {/* Customer & AI Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <CustomerInsights />
          <AIPredictionChart />
        </motion.div>

        {/* Operations & Marketing Intelligence */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <MarketingAttribution />
          <InventoryTracker />
        </motion.div>

        {/* Geographic & Cohort Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <GeographicAnalytics />
          <CohortAnalysis />
        </motion.div>

        {/* Advanced User Behavior & Marketing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="grid grid-cols-1 gap-6"
        >
          <UserBehaviorAnalytics />
        </motion.div>

        {/* Enhanced Marketing Attribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <AdvancedMarketingAttribution />
        </motion.div>

        {/* Dashboard Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span>Last updated: {new Date().toLocaleString()}</span>
              <span>•</span>
              <span>Data sources: 12 connected</span>
              <span>•</span>
              <span>Processing: Real-time</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>© 2025 Enterprise Analytics</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>All systems operational</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
