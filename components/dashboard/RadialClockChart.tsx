"use client";

import { motion } from "framer-motion";
import { PolarArea } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Clock } from "lucide-react";

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

export function RadialClockChart() {
  // Generate hourly sales data
  const hourlyData = Array.from({ length: 24 }, (_, i) => {
    const baseValue = Math.sin((i - 6) * Math.PI / 12) * 50 + 70;
    return Math.max(10, baseValue + Math.random() * 30);
  });

  const data = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: "Sales by Hour",
        data: hourlyData,
        backgroundColor: [
          "rgba(147, 51, 234, 0.6)", // Purple
          "rgba(147, 51, 234, 0.7)",
          "rgba(147, 51, 234, 0.8)",
          "rgba(59, 130, 246, 0.6)", // Blue
          "rgba(59, 130, 246, 0.7)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.6)", // Green
          "rgba(16, 185, 129, 0.7)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.6)", // Yellow
          "rgba(245, 158, 11, 0.7)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.6)", // Red
          "rgba(239, 68, 68, 0.7)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(168, 85, 247, 0.6)", // Purple
          "rgba(168, 85, 247, 0.7)",
          "rgba(168, 85, 247, 0.8)",
          "rgba(34, 197, 94, 0.6)", // Green
          "rgba(34, 197, 94, 0.7)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(59, 130, 246, 0.6)", // Blue
          "rgba(59, 130, 246, 0.7)",
          "rgba(59, 130, 246, 0.8)",
        ],
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
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
        callbacks: {
          label: (context: any) => `Sales: $${context.parsed.r.toFixed(0)}`,
        },
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        grid: {
          color: "rgba(71, 85, 105, 0.3)",
        },
        pointLabels: {
          color: "rgba(148, 163, 184, 0.8)",
          font: {
            size: 10,
          },
        },
        ticks: {
          color: "rgba(148, 163, 184, 0.6)",
          backdropColor: "transparent",
        },
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
    },
  };

  const currentHour = new Date().getHours();

  return (
        <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-white border border-gray-200 rounded-xl p-6 h-80 relative overflow-hidden shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Sales Clock</h3>
          <p className="text-gray-600 text-sm">24-hour sales pattern</p>
        </div>
        <motion.div
          className="p-3 bg-purple-500/20 rounded-lg"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <Clock className="w-6 h-6 text-purple-400" />
        </motion.div>
      </div>

      <div className="relative h-48">
        <PolarArea data={data} options={options} />
        
        {/* Current time indicator */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-2 h-16 bg-gradient-to-t from-transparent via-white to-transparent opacity-60" />
        </motion.div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="text-slate-300">
          Current: <span className="text-white font-semibold">{currentHour}:00</span>
        </div>
        <div className="text-slate-300">
          Peak: <span className="text-green-400 font-semibold">
            {hourlyData.indexOf(Math.max(...hourlyData))}:00
          </span>
        </div>
      </div>

      {/* Ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-500/5 to-transparent rounded-xl pointer-events-none" />
    </motion.div>
  );
}
