"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Users, TrendingDown, Globe, Star } from "lucide-react";
import { useSettings } from '@/hooks/useSettings';
import { formatCurrency } from '@/lib/currencies';

ChartJS.register(ArcElement, Tooltip, Legend);

export function CustomerInsights() {
  const [activeSegment, setActiveSegment] = useState<string | null>(null);
  const { currency } = useSettings();

  // Customer segments data
  const segments = {
    returning: { value: 65, color: "rgba(34, 197, 94, 0.8)", label: "Returning" },
    new: { value: 35, color: "rgba(59, 130, 246, 0.8)", label: "New" },
  };

  // Lifetime value segments
  const lifetimeValues = [
    { label: `Premium (${formatCurrency(1000, currency)}+)`, value: 15, color: "rgba(147, 51, 234, 0.8)", count: 234 },
    { label: `High Value (${formatCurrency(500, currency)}-${formatCurrency(999, currency)})`, value: 25, color: "rgba(59, 130, 246, 0.8)", count: 891 },
    { label: `Mid Value (${formatCurrency(100, currency)}-${formatCurrency(499, currency)})`, value: 40, color: "rgba(16, 185, 129, 0.8)", count: 1456 },
    { label: `Low Value (${formatCurrency(0, currency)}-${formatCurrency(99, currency)})`, value: 20, color: "rgba(245, 158, 11, 0.8)", count: 672 },
  ];

  const customerData = {
    labels: Object.values(segments).map(seg => seg.label),
    datasets: [
      {
        data: Object.values(segments).map(seg => seg.value),
        backgroundColor: Object.values(segments).map(seg => seg.color),
        borderColor: Object.values(segments).map(seg => seg.color.replace("0.8", "1")),
        borderWidth: 2,
        cutout: "60%",
      },
    ],
  };

  const lifetimeValueData = {
    labels: lifetimeValues.map(lv => lv.label),
    datasets: [
      {
        data: lifetimeValues.map(lv => lv.value),
        backgroundColor: lifetimeValues.map(lv => lv.color),
        borderColor: lifetimeValues.map(lv => lv.color.replace("0.8", "1")),
        borderWidth: 2,
        cutout: "60%",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleColor: "rgba(255, 255, 255, 0.9)",
        bodyColor: "rgba(255, 255, 255, 0.7)",
        borderColor: "rgba(71, 85, 105, 0.5)",
        borderWidth: 1,
      },
    },
  };

  const churnRate = 12.3;
  const customerSatisfaction = 4.6;

  return (
        <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white border border-gray-200 rounded-xl p-6 h-96 relative overflow-hidden shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Customer Insights</h3>
          <p className="text-gray-600 text-sm">Behavioral analytics</p>
        </div>
        <motion.div
          className="p-3 bg-blue-500/20 rounded-lg"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <Users className="w-6 h-6 text-blue-400" />
        </motion.div>
      </div>

      <div className="grid grid-cols-2 gap-6 h-72">
        {/* Customer Type Distribution */}
        <div className="relative">
          <h4 className="text-sm font-semibold text-white mb-3">Customer Types</h4>
          <div className="relative h-32">
            <Doughnut data={customerData} options={chartOptions} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-xl font-bold text-white">3.2K</div>
                <div className="text-xs text-slate-400">Total</div>
              </div>
            </div>
          </div>
          <div className="mt-3 space-y-2">
            {Object.entries(segments).map(([key, segment]) => (
              <div key={key} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: segment.color }}
                  />
                  <span className="text-slate-300">{segment.label}</span>
                </div>
                <span className="text-white font-semibold">{segment.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Lifetime Value Distribution */}
        <div className="relative">
          <h4 className="text-sm font-semibold text-white mb-3">Lifetime Value</h4>
          <div className="relative h-32">
            <Doughnut data={lifetimeValueData} options={chartOptions} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-xl font-bold text-white">{formatCurrency(432, currency)}</div>
                <div className="text-xs text-slate-400">Avg LTV</div>
              </div>
            </div>
          </div>
          <div className="mt-3 space-y-1">
            {lifetimeValues.map((lv, index) => (
              <motion.div 
                key={index} 
                className="flex items-center justify-between text-xs"
                onHoverStart={() => setActiveSegment(lv.label)}
                onHoverEnd={() => setActiveSegment(null)}
              >
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: lv.color }}
                  />
                  <span className="text-slate-400 truncate">{lv.label.split(" ")[0]}</span>
                </div>
                <span className="text-slate-300">{lv.count}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Metrics */}
      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
        <motion.div 
          className="flex items-center space-x-2 text-sm"
          whileHover={{ scale: 1.05 }}
        >
          <TrendingDown className="w-4 h-4 text-red-400" />
          <span className="text-slate-300">Churn Rate:</span>
          <span className="text-red-400 font-semibold">{churnRate}%</span>
        </motion.div>
        
        <motion.div 
          className="flex items-center space-x-2 text-sm"
          whileHover={{ scale: 1.05 }}
        >
          <Star className="w-4 h-4 text-yellow-400" />
          <span className="text-slate-300">Satisfaction:</span>
          <span className="text-yellow-400 font-semibold">{customerSatisfaction}/5</span>
        </motion.div>
      </div>

      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [-5, 5, -5],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 2 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Active segment highlight */}
      <AnimatePresence>
        {activeSegment && (
          <motion.div
            className="absolute inset-0 bg-blue-400/5 rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent rounded-xl pointer-events-none" />
    </motion.div>
  );
}
