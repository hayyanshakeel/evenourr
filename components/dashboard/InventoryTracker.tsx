"use client";

import { motion } from "framer-motion";
import { Package, AlertTriangle, TrendingDown, Clock } from "lucide-react";

interface InventoryItem {
  name: string;
  current: number;
  max: number;
  daysLeft: number;
  trend: "up" | "down" | "stable";
  supplierETA?: string;
}

export function InventoryTracker() {
  const inventoryItems: InventoryItem[] = [
    { name: "Classic Baseball Cap", current: 23, max: 100, daysLeft: 3, trend: "down", supplierETA: "2 days" },
    { name: "Vintage Fedora", current: 67, max: 150, daysLeft: 12, trend: "stable" },
    { name: "Winter Beanie", current: 8, max: 200, daysLeft: 1, trend: "down", supplierETA: "5 days" },
    { name: "Sun Hat", current: 145, max: 180, daysLeft: 28, trend: "up" },
    { name: "Snapback", current: 34, max: 120, daysLeft: 6, trend: "down", supplierETA: "3 days" },
    { name: "Bucket Hat", current: 89, max: 110, daysLeft: 18, trend: "stable" },
  ];

  const getStockLevel = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage < 20) return { level: "critical", color: "bg-red-500", glow: "shadow-red-500/50" };
    if (percentage < 40) return { level: "low", color: "bg-yellow-500", glow: "shadow-yellow-500/50" };
    if (percentage < 70) return { level: "medium", color: "bg-blue-500", glow: "shadow-blue-500/50" };
    return { level: "good", color: "bg-green-500", glow: "shadow-green-500/50" };
  };

  const criticalItems = inventoryItems.filter(item => (item.current / item.max) * 100 < 20);
  const lowStockItems = inventoryItems.filter(item => {
    const percentage = (item.current / item.max) * 100;
    return percentage >= 20 && percentage < 40;
  });

  return (
        <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-white border border-gray-200 rounded-xl p-6 h-96 relative overflow-hidden shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Inventory Tracker</h3>
          <p className="text-gray-600 text-sm">Stock levels & supply chain</p>
        </div>
        <motion.div
          className="p-3 bg-orange-500/20 rounded-lg"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <Package className="w-6 h-6 text-orange-400" />
        </motion.div>
      </div>

      {/* Stats Header */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <motion.div
          className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center"
          whileHover={{ scale: 1.05 }}
        >
          <AlertTriangle className="w-5 h-5 text-red-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-red-400">{criticalItems.length}</div>
          <div className="text-xs text-slate-400">Critical</div>
        </motion.div>
        
        <motion.div
          className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-center"
          whileHover={{ scale: 1.05 }}
        >
          <TrendingDown className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-yellow-400">{lowStockItems.length}</div>
          <div className="text-xs text-slate-400">Low Stock</div>
        </motion.div>
        
        <motion.div
          className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-center"
          whileHover={{ scale: 1.05 }}
        >
          <Clock className="w-5 h-5 text-blue-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-blue-400">
            {Math.round(inventoryItems.reduce((acc, item) => acc + item.daysLeft, 0) / inventoryItems.length)}
          </div>
          <div className="text-xs text-slate-400">Avg Days</div>
        </motion.div>
      </div>

      {/* Inventory Items */}
      <div className="space-y-3 max-h-48 overflow-y-auto">
        {inventoryItems.map((item, index) => {
          const stockInfo = getStockLevel(item.current, item.max);
          const percentage = (item.current / item.max) * 100;
          const isCritical = percentage < 20;
          
          return (
            <motion.div
              key={item.name}
              className={`bg-slate-700/30 rounded-lg p-3 relative overflow-hidden ${
                isCritical ? "ring-1 ring-red-500/50" : ""
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: 5 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-white truncate">{item.name}</span>
                  {isCritical && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                    </motion.div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-white">
                    {item.current}/{item.max}
                  </div>
                  <div className="text-xs text-slate-400">
                    {item.daysLeft} days left
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="relative w-full bg-slate-600/50 rounded-full h-2 mb-2">
                <motion.div
                  className={`h-2 rounded-full ${stockInfo.color} ${
                    isCritical ? `${stockInfo.glow} animate-pulse` : ""
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              </div>

              {/* Supplier ETA */}
              {item.supplierETA && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Supplier ETA:</span>
                  <span className="text-blue-400 font-medium">{item.supplierETA}</span>
                </div>
              )}

              {/* Critical overlay effect */}
              {isCritical && (
                <motion.div
                  className="absolute inset-0 bg-red-500/5 rounded-lg"
                  animate={{ opacity: [0, 0.3, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Background animation for critical items */}
      {criticalItems.length > 0 && (
        <motion.div
          className="absolute inset-0 bg-red-500/5 rounded-xl"
          animate={{ opacity: [0, 0.1, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}

      {/* Ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-orange-500/5 to-transparent rounded-xl pointer-events-none" />
    </motion.div>
  );
}
