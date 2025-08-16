"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ShoppingBag, Package, Truck, CheckCircle } from "lucide-react";
import { useSettings } from '@/hooks/useSettings';
import { formatCurrency } from '@/lib/currencies';

export function OrdersHeatmap() {
  const { currency } = useSettings();
  const [orderMetrics, setOrderMetrics] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    shippedOrders: 0,
    completedOrders: 0,
    avgOrderValue: 0,
    orderGrowth: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const baseOrders = 547;
      const totalOrders = baseOrders + Math.floor(Math.random() * 20);
      const pendingOrders = Math.floor(totalOrders * 0.25 + Math.random() * 10);
      const shippedOrders = Math.floor(totalOrders * 0.35 + Math.random() * 15);
      const completedOrders = totalOrders - pendingOrders - shippedOrders;
      
      const avgOrderValue = 78 + Math.random() * 25;
      const orderGrowth = 8.5 + Math.random() * 5;

      setOrderMetrics({
        totalOrders,
        pendingOrders,
        shippedOrders,
        completedOrders,
        avgOrderValue,
        orderGrowth,
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const orderStages = [
    { 
      label: "Pending", 
      value: orderMetrics.pendingOrders, 
      icon: ShoppingBag, 
      color: "orange",
      bgColor: "orange-100",
      textColor: "orange-600"
    },
    { 
      label: "Processing", 
      value: orderMetrics.shippedOrders, 
      icon: Package, 
      color: "blue",
      bgColor: "blue-100", 
      textColor: "blue-600"
    },
    { 
      label: "Shipped", 
      value: Math.floor(orderMetrics.shippedOrders * 0.7), 
      icon: Truck, 
      color: "purple",
      bgColor: "purple-100",
      textColor: "purple-600"
    },
    { 
      label: "Completed", 
      value: orderMetrics.completedOrders, 
      icon: CheckCircle, 
      color: "green",
      bgColor: "green-100",
      textColor: "green-600"
    },
  ];

  return (
    <motion.div
      className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <ShoppingBag className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Order Management</h3>
            <p className="text-xs text-gray-400">Live order tracking</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-500">Growth</span>
          <div className="text-sm font-semibold text-green-600">
            +{orderMetrics.orderGrowth.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Total Orders */}
      <div className="mb-4">
        <motion.div
          key={orderMetrics.totalOrders}
          initial={{ scale: 0.95, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-3xl font-bold text-gray-900"
        >
          {orderMetrics.totalOrders.toLocaleString()}
        </motion.div>
        <p className="text-sm text-gray-500">
          Total orders • {formatCurrency(orderMetrics.avgOrderValue, currency)} avg value
        </p>
      </div>

      {/* Order Stages */}
      <div className="space-y-3 pt-4 border-t border-gray-100">
        {orderStages.map((stage, index) => {
          const Icon = stage.icon;
          return (
            <motion.div
              key={stage.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-1.5 bg-${stage.bgColor} rounded-md`}>
                  <Icon className={`w-3 h-3 text-${stage.textColor}`} />
                </div>
                <span className="text-sm text-gray-600">{stage.label}</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {stage.value.toLocaleString()}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
