"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Clock, Users, TrendingUp, Calendar, Target } from "lucide-react";

interface CohortData {
  cohort: string;
  period0: number;
  period1: number;
  period2: number;
  period3: number;
  period4: number;
  period5: number;
  period6: number;
  totalUsers: number;
}

interface RetentionMetrics {
  overall: number;
  day1: number;
  day7: number;
  day30: number;
  day90: number;
}

export function CohortAnalysis() {
  const [cohortData, setCohortData] = useState<CohortData[]>([]);
  const [retentionMetrics, setRetentionMetrics] = useState<RetentionMetrics>({
    overall: 0,
    day1: 0,
    day7: 0,
    day30: 0,
    day90: 0
  });
  const [selectedView, setSelectedView] = useState<'percentage' | 'absolute'>('percentage');

  useEffect(() => {
    // Simulate cohort data
    const mockCohorts: CohortData[] = [
      { cohort: "Jan 2025", period0: 100, period1: 42, period2: 28, period3: 21, period4: 18, period5: 16, period6: 14, totalUsers: 1250 },
      { cohort: "Feb 2025", period0: 100, period1: 45, period2: 31, period3: 24, period4: 20, period5: 18, period6: 16, totalUsers: 1180 },
      { cohort: "Mar 2025", period0: 100, period1: 48, period2: 34, period3: 27, period4: 23, period5: 20, period6: 18, totalUsers: 1420 },
      { cohort: "Apr 2025", period0: 100, period1: 51, period2: 37, period3: 30, period4: 26, period5: 23, period6: 21, totalUsers: 1350 },
      { cohort: "May 2025", period0: 100, period1: 53, period2: 39, period3: 32, period4: 28, period5: 25, period6: 0, totalUsers: 1480 },
      { cohort: "Jun 2025", period0: 100, period1: 55, period2: 41, period3: 34, period4: 30, period5: 0, period6: 0, totalUsers: 1580 },
      { cohort: "Jul 2025", period0: 100, period1: 58, period2: 43, period3: 36, period4: 0, period5: 0, period6: 0, totalUsers: 1720 },
      { cohort: "Aug 2025", period0: 100, period1: 61, period2: 45, period3: 0, period4: 0, period5: 0, period6: 0, totalUsers: 1650 },
    ];

    const metrics: RetentionMetrics = {
      overall: 24.5,
      day1: 58.2,
      day7: 41.3,
      day30: 28.7,
      day90: 19.4
    };

    setCohortData(mockCohorts);
    setRetentionMetrics(metrics);
  }, []);

  const getColorIntensity = (value: number, maxValue: number = 100) => {
    if (value === 0) return 'bg-gray-100';
    const intensity = (value / maxValue) * 100;
    if (intensity >= 80) return 'bg-green-600 text-white';
    if (intensity >= 60) return 'bg-green-500 text-white';
    if (intensity >= 40) return 'bg-green-400 text-white';
    if (intensity >= 20) return 'bg-green-300';
    if (intensity >= 10) return 'bg-green-200';
    return 'bg-green-100';
  };

  const formatValue = (value: number, totalUsers: number) => {
    if (value === 0) return '-';
    if (selectedView === 'percentage') {
      return `${value}%`;
    } else {
      return Math.round((value / 100) * totalUsers).toString();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Cohort Analysis</h3>
            <p className="text-sm text-gray-500">User retention by acquisition period</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedView('percentage')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedView === 'percentage'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Percentage
          </button>
          <button
            onClick={() => setSelectedView('absolute')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedView === 'absolute'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Absolute
          </button>
        </div>
      </div>

      {/* Retention Metrics Summary */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Day 1', value: retentionMetrics.day1, icon: Clock },
          { label: 'Day 7', value: retentionMetrics.day7, icon: Calendar },
          { label: 'Day 30', value: retentionMetrics.day30, icon: Target },
          { label: 'Day 90', value: retentionMetrics.day90, icon: TrendingUp },
          { label: 'Overall', value: retentionMetrics.overall, icon: Users },
        ].map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="text-center p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center justify-center space-x-2 mb-2">
              <metric.icon className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-600">{metric.label}</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{metric.value}%</div>
          </motion.div>
        ))}
      </div>

      {/* Cohort Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-600">Cohort</th>
              <th className="text-center py-3 px-4 font-medium text-gray-600">Users</th>
              <th className="text-center py-3 px-4 font-medium text-gray-600">Period 0</th>
              <th className="text-center py-3 px-4 font-medium text-gray-600">Period 1</th>
              <th className="text-center py-3 px-4 font-medium text-gray-600">Period 2</th>
              <th className="text-center py-3 px-4 font-medium text-gray-600">Period 3</th>
              <th className="text-center py-3 px-4 font-medium text-gray-600">Period 4</th>
              <th className="text-center py-3 px-4 font-medium text-gray-600">Period 5</th>
              <th className="text-center py-3 px-4 font-medium text-gray-600">Period 6</th>
            </tr>
          </thead>
          <tbody>
            {cohortData.map((cohort, index) => (
              <motion.tr
                key={cohort.cohort}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-3 px-4 font-medium text-gray-900">{cohort.cohort}</td>
                <td className="py-3 px-4 text-center text-gray-600">{cohort.totalUsers.toLocaleString()}</td>
                <td className={`py-3 px-4 text-center text-sm font-medium rounded-md ${getColorIntensity(cohort.period0)}`}>
                  {formatValue(cohort.period0, cohort.totalUsers)}
                </td>
                <td className={`py-3 px-4 text-center text-sm font-medium rounded-md ${getColorIntensity(cohort.period1)}`}>
                  {formatValue(cohort.period1, cohort.totalUsers)}
                </td>
                <td className={`py-3 px-4 text-center text-sm font-medium rounded-md ${getColorIntensity(cohort.period2)}`}>
                  {formatValue(cohort.period2, cohort.totalUsers)}
                </td>
                <td className={`py-3 px-4 text-center text-sm font-medium rounded-md ${getColorIntensity(cohort.period3)}`}>
                  {formatValue(cohort.period3, cohort.totalUsers)}
                </td>
                <td className={`py-3 px-4 text-center text-sm font-medium rounded-md ${getColorIntensity(cohort.period4)}`}>
                  {formatValue(cohort.period4, cohort.totalUsers)}
                </td>
                <td className={`py-3 px-4 text-center text-sm font-medium rounded-md ${getColorIntensity(cohort.period5)}`}>
                  {formatValue(cohort.period5, cohort.totalUsers)}
                </td>
                <td className={`py-3 px-4 text-center text-sm font-medium rounded-md ${getColorIntensity(cohort.period6)}`}>
                  {formatValue(cohort.period6, cohort.totalUsers)}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Retention Rate:</span>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-600 rounded"></div>
            <span className="text-xs text-gray-500">High (60%+)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-400 rounded"></div>
            <span className="text-xs text-gray-500">Medium (30-60%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-200 rounded"></div>
            <span className="text-xs text-gray-500">Low (0-30%)</span>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          Periods represent months since acquisition
        </div>
      </div>
    </motion.div>
  );
}
