"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Bubble } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Package } from "lucide-react";

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

interface Product {
  name: string;
  sales: number;
  profit: number;
  volume: number;
  color: string;
}

export function ProductBubbleChart() {
  const [products] = useState<Product[]>([
    { name: "Classic Baseball Cap", sales: 85, profit: 25, volume: 150, color: "rgba(59, 130, 246, 0.7)" },
    { name: "Vintage Fedora", sales: 62, profit: 45, volume: 80, color: "rgba(147, 51, 234, 0.7)" },
    { name: "Winter Beanie", sales: 78, profit: 15, volume: 200, color: "rgba(34, 197, 94, 0.7)" },
    { name: "Sun Hat", sales: 45, profit: 35, volume: 60, color: "rgba(245, 158, 11, 0.7)" },
    { name: "Snapback", sales: 92, profit: 20, volume: 180, color: "rgba(239, 68, 68, 0.7)" },
    { name: "Bucket Hat", sales: 38, profit: 30, volume: 90, color: "rgba(168, 85, 247, 0.7)" },
    { name: "Trucker Cap", sales: 71, profit: 18, volume: 120, color: "rgba(16, 185, 129, 0.7)" },
  ]);

  const data = {
    datasets: [
      {
        label: "Products Performance",
        data: products.map(product => ({
          x: product.sales,
          y: product.profit,
          r: Math.sqrt(product.volume) / 2,
        })),
        backgroundColor: products.map(product => product.color),
        borderColor: products.map(product => product.color.replace("0.7", "1")),
        borderWidth: 2,
        hoverBackgroundColor: products.map(product => product.color.replace("0.7", "0.9")),
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
          title: (context: any) => {
            const dataIndex = context[0]?.dataIndex;
            return dataIndex !== undefined && products[dataIndex] ? products[dataIndex].name : "";
          },
          label: (context: any) => [
            `Sales Score: ${context.parsed.x}%`,
            `Profit Margin: ${context.parsed.y}%`,
            `Volume: ${products[context.dataIndex]?.volume || 0} units`,
          ],
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Sales Performance (%)",
          color: "rgba(148, 163, 184, 0.8)",
        },
        grid: {
          color: "rgba(71, 85, 105, 0.3)",
        },
        ticks: {
          color: "rgba(148, 163, 184, 0.6)",
        },
      },
      y: {
        title: {
          display: true,
          text: "Profit Margin (%)",
          color: "rgba(148, 163, 184, 0.8)",
        },
        grid: {
          color: "rgba(71, 85, 105, 0.3)",
        },
        ticks: {
          color: "rgba(148, 163, 184, 0.6)",
        },
      },
    },
    animation: {
      duration: 2000,
      easing: "easeInOutQuart" as const,
    },
  };

  return (
        <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-white border border-gray-200 rounded-xl p-6 h-80 relative overflow-hidden shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Product Performance</h3>
          <p className="text-gray-600 text-sm">Sales vs. profit analysis</p>
        </div>
        <motion.div
          className="p-3 bg-orange-500/20 rounded-lg"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <Package className="w-6 h-6 text-orange-400" />
        </motion.div>
      </div>

      <div className="relative h-48">
        <Bubble data={data} options={options} />
      </div>

      {/* Floating bubbles animation in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full"
            style={{
              left: `${20 + i * 20}%`,
              top: `${30 + i * 15}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              x: [-5, 5, -5],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="mt-2 text-xs text-slate-400">
        Bubble size represents sales volume
      </div>

      {/* Ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-orange-500/5 to-transparent rounded-xl pointer-events-none" />
    </motion.div>
  );
}
