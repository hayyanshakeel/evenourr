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
import { Brain, TrendingUp } from "lucide-react";

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

export function AIPredictionChart() {
  // Generate historical and predicted data
  const historicalDays = 30;
  const futureDays = 14;
  
  const generateSalesData = (days: number, startValue: number = 1000) => {
    const data = [];
    let value = startValue;
    for (let i = 0; i < days; i++) {
      value += (Math.random() - 0.5) * 200 + Math.sin(i / 7) * 100;
      data.push(Math.max(0, value));
    }
    return data;
  };

  const historicalData = generateSalesData(historicalDays);
  const predictedData = generateSalesData(futureDays, historicalData[historicalData.length - 1]);

  const labels = [
    ...Array.from({ length: historicalDays }, (_, i) => `Day ${i + 1}`),
    ...Array.from({ length: futureDays }, (_, i) => `+${i + 1}`),
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Actual Sales",
        data: [...historicalData, ...Array(futureDays).fill(null)],
        borderColor: "rgba(34, 197, 94, 1)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 6,
      },
      {
        label: "AI Prediction",
        data: [...Array(historicalDays - 1).fill(null), historicalData[historicalData.length - 1], ...predictedData],
        borderColor: "rgba(147, 51, 234, 1)",
        backgroundColor: "rgba(147, 51, 234, 0.1)",
        borderWidth: 3,
        borderDash: [5, 5],
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 6,
      },
      {
        label: "Confidence Interval",
        data: [...Array(historicalDays).fill(null), ...predictedData.map(val => val * 1.2)],
        borderColor: "rgba(147, 51, 234, 0.3)",
        backgroundColor: "rgba(147, 51, 234, 0.05)",
        borderWidth: 1,
        fill: "+1",
        tension: 0.4,
        pointRadius: 0,
      },
      {
        label: "Lower Bound",
        data: [...Array(historicalDays).fill(null), ...predictedData.map(val => val * 0.8)],
        borderColor: "rgba(147, 51, 234, 0.3)",
        backgroundColor: "rgba(147, 51, 234, 0.05)",
        borderWidth: 1,
        fill: false,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: {
          color: "rgba(148, 163, 184, 0.8)",
          font: {
            size: 11,
          },
          filter: (item: any) => item.text !== "Confidence Interval" && item.text !== "Lower Bound",
        },
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
          maxTicksLimit: 8,
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
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
  };

  const accuracy = 87 + Math.random() * 8; // Simulate 87-95% accuracy

  return (
        <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white border border-gray-200 rounded-xl p-6 h-80 relative overflow-hidden shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">AI Sales Forecast</h3>
          <p className="text-gray-600 text-sm">14-day prediction model</p>
        </div>
        <motion.div
          className="p-3 bg-purple-500/20 rounded-lg"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <Brain className="w-6 h-6 text-purple-400" />
        </motion.div>
      </div>

      <div className="relative h-44">
        <Line data={data} options={options} />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-sm text-slate-300">
              Accuracy: <span className="text-green-400 font-semibold">{accuracy.toFixed(1)}%</span>
            </span>
          </div>
        </div>
        <div className="text-sm text-slate-400">
          Updated 2 min ago
        </div>
      </div>

      {/* AI processing animation */}
      <motion.div
        className="absolute top-4 right-4"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      >
        <div className="w-2 h-2 bg-purple-400 rounded-full" />
      </motion.div>

      {/* Ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-500/5 to-transparent rounded-xl pointer-events-none" />
    </motion.div>
  );
}
