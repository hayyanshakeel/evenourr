"use client";

import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Megaphone, TrendingUp, Search, Mail, Share2 } from "lucide-react";
import { useSettings } from '@/hooks/useSettings';
import { formatCurrency } from '@/lib/currencies';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function MarketingAttribution() {
  const { currency } = useSettings();
  
  // Traffic sources data
  const sources = [
    { name: "Google Ads", value: 45, icon: Search, color: "rgb(34, 197, 94)", trend: "+12%" },
    { name: "Facebook", value: 28, icon: Share2, color: "rgb(59, 130, 246)", trend: "+8%" },
    { name: "Email", value: 18, icon: Mail, color: "rgb(147, 51, 234)", trend: "+5%" },
    { name: "Organic", value: 9, icon: TrendingUp, color: "rgb(245, 158, 11)", trend: "-2%" },
  ];

  // Campaign timeline data
  const timelineData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
    datasets: [
      {
        label: "Sales Impact",
        data: [120, 190, 300, 500, 200, 300],
        borderColor: "rgba(34, 197, 94, 1)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: "rgba(34, 197, 94, 1)",
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
    scales: {
      x: {
        grid: {
          color: "rgba(71, 85, 105, 0.3)",
        },
        ticks: {
          color: "rgba(148, 163, 184, 0.6)",
        },
      },
      y: {
        grid: {
          color: "rgba(71, 85, 105, 0.3)",
        },
        ticks: {
          color: "rgba(148, 163, 184, 0.6)",
        },
      },
    },
  };

  return (
        <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white border border-gray-200 rounded-xl p-6 h-96 relative overflow-hidden shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Marketing Attribution</h3>
          <p className="text-gray-600 text-sm">Campaign performance tracking</p>
        </div>
        <motion.div
          className="p-3 bg-green-500/20 rounded-lg"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <Megaphone className="w-6 h-6 text-green-400" />
        </motion.div>
      </div>

      <div className="grid grid-cols-3 gap-4 h-80">
        {/* Traffic Sources */}
        <div className="col-span-1">
          <h4 className="text-sm font-semibold text-white mb-3">Traffic Sources</h4>
          <div className="space-y-3">
            {sources.map((source, index) => {
              const IconComponent = source.icon;
              const isPositive = source.trend.startsWith("+");
              
              return (
                <motion.div
                  key={source.name}
                  className="bg-slate-700/30 rounded-lg p-3 relative overflow-hidden"
                  whileHover={{ scale: 1.05, x: 5 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <IconComponent className="w-4 h-4" style={{ color: source.color }} />
                      <span className="text-sm text-slate-300">{source.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-white">{source.value}%</div>
                      <div className={`text-xs ${isPositive ? "text-green-400" : "text-red-400"}`}>
                        {source.trend}
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="mt-2 w-full bg-slate-600/50 rounded-full h-1">
                    <motion.div
                      className="h-1 rounded-full"
                      style={{ backgroundColor: source.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${source.value}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Campaign Timeline */}
        <div className="col-span-2">
          <h4 className="text-sm font-semibold text-white mb-3">Sales Impact Timeline</h4>
          <div className="h-48">
            <Line data={timelineData} options={chartOptions} />
          </div>
          
          {/* Campaign markers */}
          <div className="mt-4 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-slate-400">Summer Sale</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                <span className="text-slate-400">Back to School</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full" />
                <span className="text-slate-400">Flash Sale</span>
              </div>
            </div>
            <div className="text-slate-400">
              ROAS: <span className="text-green-400 font-semibold">4.2x</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Keywords */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="flex items-center justify-between">
          <div>
            <h5 className="text-xs font-semibold text-slate-400 mb-1">Top Keywords</h5>
            <div className="flex items-center space-x-3 text-xs">
              <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded">"baseball caps"</span>
              <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded">"summer hats"</span>
              <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded">"fedora"</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400">Total Spend</div>
            <div className="text-sm font-semibold text-white">{formatCurrency(12450, currency)}</div>
          </div>
        </div>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-green-400/20 rounded-full"
            style={{
              left: `${15 + i * 15}%`,
              top: `${25 + i * 10}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      {/* Ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-green-500/5 to-transparent rounded-xl pointer-events-none" />
    </motion.div>
  );
}
