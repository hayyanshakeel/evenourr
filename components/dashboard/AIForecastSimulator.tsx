"use client";

import { motion } from "framer-motion";
import { useState } from "react";
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
import { Brain, Sliders, TrendingUp, DollarSign, Percent, Cloud } from "lucide-react";
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

export function AIForecastSimulator() {
  const [adSpend, setAdSpend] = useState(5000);
  const [discountPercent, setDiscountPercent] = useState(15);
  const [weatherFactor, setWeatherFactor] = useState(75); // 75 = good weather
  const { currency } = useSettings();

  // Calculate forecast based on parameters
  const calculateForecast = () => {
    const baseRevenue = 50000;
    const adSpendMultiplier = 1 + (adSpend / 10000) * 0.8; // Each 10k in currency adds 80% revenue
    const discountMultiplier = 1 + (discountPercent / 100) * 1.5; // Each 1% discount adds 1.5% revenue
    const weatherMultiplier = 0.8 + (weatherFactor / 100) * 0.4; // Weather affects 20-40% of sales

    const forecastRevenue = baseRevenue * adSpendMultiplier * discountMultiplier * weatherMultiplier;
    
    // Generate daily data for 30 days
    const days = 30;
    const data = [];
    for (let i = 0; i < days; i++) {
      const dailyBase = forecastRevenue / 30;
      const weekdayFactors = [0.7, 0.8, 0.9, 1.0, 1.2, 1.3, 1.1];
      const weekdayFactor = weekdayFactors[i % 7] || 1.0; // Weekend boost
      const randomVariation = 0.8 + Math.random() * 0.4;
      data.push(dailyBase * weekdayFactor * randomVariation);
    }
    return data;
  };

  const forecastData = calculateForecast();
  const totalForecast = forecastData.reduce((sum, val) => sum + val, 0);
  const avgDaily = totalForecast / 30;

  const chartData = {
    labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
    datasets: [
      {
        label: "Forecasted Revenue",
        data: forecastData,
        borderColor: "rgba(147, 51, 234, 1)",
        backgroundColor: "rgba(147, 51, 234, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 6,
      },
      {
        label: "Baseline",
        data: Array(30).fill(50000 / 30),
        borderColor: "rgba(71, 85, 105, 0.5)",
        backgroundColor: "transparent",
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        pointRadius: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: {
          color: "rgba(148, 163, 184, 0.8)",
          font: { size: 11 },
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleColor: "rgba(255, 255, 255, 0.9)",
        bodyColor: "rgba(255, 255, 255, 0.7)",
        borderColor: "rgba(71, 85, 105, 0.5)",
        borderWidth: 1,
        callbacks: {
          label: (context: any) => `Revenue: ${formatCurrency(context.parsed.y, currency)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(71, 85, 105, 0.3)" },
        ticks: { 
          color: "rgba(148, 163, 184, 0.6)",
          maxTicksLimit: 8,
        },
      },
      y: {
        grid: { color: "rgba(71, 85, 105, 0.3)" },
        ticks: { 
          color: "rgba(148, 163, 184, 0.6)",
          callback: (value: any) => `${formatCurrency(value / 1000, currency)}k`,
        },
      },
    },
  };

  const getWeatherLabel = (factor: number) => {
    if (factor < 40) return { label: "Stormy", color: "text-red-400", icon: "🌧️" };
    if (factor < 60) return { label: "Cloudy", color: "text-yellow-400", icon: "☁️" };
    if (factor < 80) return { label: "Partly Cloudy", color: "text-blue-400", icon: "⛅" };
    return { label: "Sunny", color: "text-green-400", icon: "☀️" };
  };

  const weather = getWeatherLabel(weatherFactor);
  const roi = ((totalForecast - adSpend - 50000) / (adSpend + 50000) * 100);

  return (
    <motion.div
      className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 relative overflow-hidden"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">AI Forecast Simulator</h3>
          <p className="text-slate-400 text-sm">Interactive sales prediction modeling</p>
        </div>
        <motion.div
          className="p-3 bg-purple-500/20 rounded-lg"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <Brain className="w-6 h-6 text-purple-400" />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Controls */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Sliders className="w-4 h-4 text-slate-400" />
              <h4 className="text-sm font-semibold text-white">Parameters</h4>
            </div>
            
            {/* Ad Spend Slider */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-slate-300">Ad Spend</label>
                <span className="text-sm font-semibold text-blue-400">
                  {formatCurrency(adSpend, currency)}
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="20000"
                step="500"
                value={adSpend}
                onChange={(e) => setAdSpend(Number(e.target.value))}
                className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* Discount Slider */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-slate-300">Discount %</label>
                <span className="text-sm font-semibold text-green-400">
                  {discountPercent}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* Weather Factor */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-slate-300">Weather</label>
                <span className={`text-sm font-semibold ${weather.color} flex items-center space-x-1`}>
                  <span>{weather.icon}</span>
                  <span>{weather.label}</span>
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                step="10"
                value={weatherFactor}
                onChange={(e) => setWeatherFactor(Number(e.target.value))}
                className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>

          {/* Forecast Metrics */}
          <div className="space-y-3">
            <motion.div
              className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center space-x-2 mb-1">
                <DollarSign className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-slate-400">30-Day Forecast</span>
              </div>
              <div className="text-lg font-bold text-purple-400">
                ${totalForecast.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </div>
            </motion.div>

            <motion.div
              className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center space-x-2 mb-1">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-slate-400">Daily Average</span>
              </div>
              <div className="text-lg font-bold text-blue-400">
                ${avgDaily.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </div>
            </motion.div>

            <motion.div
              className={`${roi > 0 ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"} border rounded-lg p-3`}
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center space-x-2 mb-1">
                <Percent className="w-4 h-4 text-green-400" />
                <span className="text-xs text-slate-400">Expected ROI</span>
              </div>
              <div className={`text-lg font-bold ${roi > 0 ? "text-green-400" : "text-red-400"}`}>
                {roi > 0 ? "+" : ""}{roi.toFixed(1)}%
              </div>
            </motion.div>
          </div>
        </div>

        {/* Chart */}
        <div className="col-span-3 h-80">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* AI Status */}
      <div className="absolute top-6 right-6">
        <motion.div
          className="flex items-center space-x-2 text-xs text-slate-400"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-2 h-2 bg-purple-400 rounded-full" />
          <span>AI Processing</span>
        </motion.div>
      </div>

      {/* Ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-500/5 to-transparent rounded-xl pointer-events-none" />

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          background: #8b5cf6;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(139, 92, 246, 0.3);
        }

        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          background: #8b5cf6;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 8px rgba(139, 92, 246, 0.3);
        }
      `}</style>
    </motion.div>
  );
}
