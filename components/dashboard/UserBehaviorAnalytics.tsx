"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { MousePointer, Eye, Clock, TrendingUp, AlertCircle } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface HeatmapData {
  element: string;
  clicks: number;
  views: number;
  ctr: number;
  avgTimeOnElement: number;
  conversionRate: number;
}

interface ScrollData {
  depth: string;
  percentage: number;
  users: number;
}

export function UserBehaviorAnalytics() {
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [scrollData, setScrollData] = useState<ScrollData[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<'clicks' | 'ctr' | 'conversion'>('clicks');

  useEffect(() => {
    // Simulate heatmap data
    const mockHeatmap: HeatmapData[] = [
      { element: "Hero CTA Button", clicks: 2847, views: 12450, ctr: 22.9, avgTimeOnElement: 3.4, conversionRate: 18.2 },
      { element: "Product Image #1", clicks: 1923, views: 11200, ctr: 17.2, avgTimeOnElement: 5.7, conversionRate: 12.4 },
      { element: "Add to Cart", clicks: 1567, views: 8900, ctr: 17.6, avgTimeOnElement: 2.1, conversionRate: 45.3 },
      { element: "Navigation Menu", clicks: 1234, views: 10500, ctr: 11.8, avgTimeOnElement: 1.2, conversionRate: 3.2 },
      { element: "Footer Links", clicks: 987, views: 6700, ctr: 14.7, avgTimeOnElement: 0.8, conversionRate: 2.1 },
      { element: "Search Bar", clicks: 856, views: 9800, ctr: 8.7, avgTimeOnElement: 4.2, conversionRate: 8.9 },
      { element: "Product Reviews", clicks: 743, views: 5600, ctr: 13.3, avgTimeOnElement: 12.4, conversionRate: 6.7 },
      { element: "Newsletter Signup", clicks: 654, views: 7800, ctr: 8.4, avgTimeOnElement: 2.8, conversionRate: 15.6 },
    ];

    const mockScroll: ScrollData[] = [
      { depth: "0-25%", percentage: 100, users: 12450 },
      { depth: "25-50%", percentage: 78.3, users: 9748 },
      { depth: "50-75%", percentage: 54.2, users: 6748 },
      { depth: "75-100%", percentage: 23.1, users: 2876 },
    ];

    setHeatmapData(mockHeatmap);
    setScrollData(mockScroll);
  }, []);

  const getMetricValue = (item: HeatmapData) => {
    switch (selectedMetric) {
      case 'clicks': return item.clicks;
      case 'ctr': return item.ctr;
      case 'conversion': return item.conversionRate;
      default: return item.clicks;
    }
  };

  const getMetricLabel = () => {
    switch (selectedMetric) {
      case 'clicks': return 'Total Clicks';
      case 'ctr': return 'Click-Through Rate (%)';
      case 'conversion': return 'Conversion Rate (%)';
      default: return 'Total Clicks';
    }
  };

  const scrollChartData = {
    labels: scrollData.map(d => d.depth),
    datasets: [
      {
        label: 'User Scroll Depth',
        data: scrollData.map(d => d.percentage),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 2,
        borderRadius: 8,
      }
    ]
  };

  const scrollChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        callbacks: {
          label: function(context: any) {
            const dataIndex = context.dataIndex;
            const users = scrollData[dataIndex]?.users || 0;
            return [`${context.parsed.y}% of users`, `${users.toLocaleString()} users`];
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12
          }
        }
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          callback: function(value: any) {
            return value + '%';
          },
          font: {
            size: 12
          }
        }
      }
    }
  };

  const maxValue = Math.max(...heatmapData.map(getMetricValue));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <MousePointer className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">User Behavior Analytics</h3>
            <p className="text-sm text-gray-500">Click heatmaps and scroll behavior analysis</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {(['clicks', 'ctr', 'conversion'] as const).map((metric) => (
            <button
              key={metric}
              onClick={() => setSelectedMetric(metric)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedMetric === metric
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {metric === 'ctr' ? 'CTR' : metric.charAt(0).toUpperCase() + metric.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Element Heatmap */}
        <div className="lg:col-span-2">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Element Performance Heatmap</h4>
          <div className="space-y-3">
            {heatmapData.map((item, index) => {
              const value = getMetricValue(item);
              const percentage = (value / maxValue) * 100;
              
              return (
                <motion.div
                  key={item.element}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-gray-900">{item.element}</span>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{item.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MousePointer className="w-3 h-3" />
                        <span>{item.clicks.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{item.avgTimeOnElement}s</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-900">
                      {selectedMetric === 'clicks' ? value.toLocaleString() : `${value}%`}
                    </span>
                    <span className="text-xs text-gray-500">{getMetricLabel()}</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full ${
                        selectedMetric === 'clicks' ? 'bg-gradient-to-r from-orange-500 to-red-600' :
                        selectedMetric === 'ctr' ? 'bg-gradient-to-r from-blue-500 to-purple-600' :
                        'bg-gradient-to-r from-green-500 to-emerald-600'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                    <span>CTR: {item.ctr}%</span>
                    <span>Conv: {item.conversionRate}%</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Scroll Depth Analysis */}
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-4">Scroll Depth Analysis</h4>
          
          {/* Scroll Chart */}
          <div className="h-64 mb-6">
            <Bar data={scrollChartData} options={scrollChartOptions} />
          </div>

          {/* Scroll Insights */}
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Engagement Insights</span>
              </div>
              <div className="text-xs text-blue-700">
                <div>• 78% users scroll past hero section</div>
                <div>• 54% engage with product content</div>
                <div>• 23% reach footer (high intent)</div>
              </div>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-900">Optimization Tips</span>
              </div>
              <div className="text-xs text-orange-700">
                <div>• Move key CTAs above 50% mark</div>
                <div>• Reduce content length</div>
                <div>• Add sticky navigation</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-900">2.3s</div>
                <div className="text-xs text-gray-600">Avg. Hover Time</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-900">4.7</div>
                <div className="text-xs text-gray-600">Clicks per Session</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
