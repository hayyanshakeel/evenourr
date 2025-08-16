"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Users, Eye, ShoppingCart, CreditCard, CheckCircle } from "lucide-react";

interface FunnelStage {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  percentage: number;
  color: string;
  bgColor: string;
}

export function ConversionFunnel() {
  const [selectedStage, setSelectedStage] = useState<number | null>(null);

  const stages: FunnelStage[] = [
    {
      label: "Visitors",
      icon: Users,
      value: 12450,
      percentage: 100,
      color: "text-blue-400",
      bgColor: "bg-blue-400",
    },
    {
      label: "Product Views",
      icon: Eye,
      value: 8932,
      percentage: 71.7,
      color: "text-purple-400",
      bgColor: "bg-purple-400",
    },
    {
      label: "Add to Cart",
      icon: ShoppingCart,
      value: 2876,
      percentage: 23.1,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400",
    },
    {
      label: "Checkout",
      icon: CreditCard,
      value: 1543,
      percentage: 12.4,
      color: "text-orange-400",
      bgColor: "bg-orange-400",
    },
    {
      label: "Purchase",
      icon: CheckCircle,
      value: 987,
      percentage: 7.9,
      color: "text-green-400",
      bgColor: "bg-green-400",
    },
  ];

  const conversionRate = stages[4] && stages[0] 
    ? ((stages[4].value / stages[0].value) * 100).toFixed(1)
    : "0.0";

  return (
        <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white border border-gray-200 rounded-xl p-6 h-96 relative overflow-hidden shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Conversion Funnel</h3>
          <p className="text-gray-600 text-sm">Customer journey analytics</p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{conversionRate}%</div>
          <div className="text-xs text-gray-500">Overall Rate</div>
        </div>
      </div>

      <div className="space-y-4">
        {stages.map((stage, index) => {
          const IconComponent = stage.icon;
          const isSelected = selectedStage === index;
          const fillPercentage = stages[0] ? (stage.value / stages[0].value) * 100 : 0;

          return (
            <motion.div
              key={stage.label}
              className={`relative cursor-pointer transition-all duration-300 ${
                isSelected ? "scale-105" : ""
              }`}
              onHoverStart={() => setSelectedStage(index)}
              onHoverEnd={() => setSelectedStage(null)}
              whileHover={{ x: 5 }}
            >
              {/* Funnel shape background */}
              <div className="relative h-12 overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-slate-700/30 rounded-lg"
                  style={{
                    clipPath: `polygon(0% 0%, ${90 - index * 15}% 0%, ${85 - index * 15}% 100%, 0% 100%)`,
                  }}
                />
                
                {/* Liquid fill effect */}
                <motion.div
                  className={`absolute inset-0 ${stage.bgColor} opacity-70 rounded-lg`}
                  style={{
                    clipPath: `polygon(0% 0%, ${90 - index * 15}% 0%, ${85 - index * 15}% 100%, 0% 100%)`,
                    width: `${fillPercentage}%`,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${fillPercentage}%` }}
                  transition={{ duration: 1.5, delay: index * 0.2 }}
                />

                {/* Content */}
                <div className="relative z-10 flex items-center justify-between h-full px-4">
                  <div className="flex items-center space-x-3">
                    <IconComponent className={`w-5 h-5 ${stage.color}`} />
                    <span className="text-white font-medium">{stage.label}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold">
                      {stage.value.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-300">
                      {stage.percentage}%
                    </div>
                  </div>
                </div>

                {/* Animated sparkles */}
                {isSelected && (
                  <motion.div className="absolute inset-0 pointer-events-none">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                          left: `${20 + i * 25}%`,
                          top: "50%",
                        }}
                        animate={{
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Drop-off indicator */}
              {index < stages.length - 1 && stages[index] && stages[index + 1] && (
                <div className="flex items-center justify-center my-1">
                  <div className="text-xs text-slate-500">
                    -{((stages[index]!.value - stages[index + 1]!.value) / stages[index]!.value * 100).toFixed(1)}% drop-off
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Background animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-green-500/5"
          animate={{
            background: [
              "linear-gradient(to bottom, transparent, rgba(59, 130, 246, 0.05), rgba(34, 197, 94, 0.05))",
              "linear-gradient(to bottom, transparent, rgba(147, 51, 234, 0.05), rgba(34, 197, 94, 0.05))",
              "linear-gradient(to bottom, transparent, rgba(59, 130, 246, 0.05), rgba(34, 197, 94, 0.05))",
            ],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </motion.div>
  );
}
