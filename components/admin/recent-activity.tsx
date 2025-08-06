"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, ShoppingCart, Package, Users, CreditCard } from "lucide-react"

const activities = [
  {
    type: "order",
    title: "New order #ORD-2024-001",
    description: "₹2,340 from John Doe",
    time: "2 minutes ago",
    icon: ShoppingCart,
    status: "success",
  },
  {
    type: "product",
    title: "Product updated",
    description: "iPhone 15 Pro inventory updated",
    time: "5 minutes ago",
    icon: Package,
    status: "info",
  },
  {
    type: "customer",
    title: "New customer registered",
    description: "Sarah Wilson joined",
    time: "10 minutes ago",
    icon: Users,
    status: "success",
  },
  {
    type: "payment",
    title: "Payment failed",
    description: "Order #ORD-2024-002 payment declined",
    time: "15 minutes ago",
    icon: CreditCard,
    status: "error",
  },
  {
    type: "order",
    title: "Order shipped",
    description: "Order #ORD-2024-003 dispatched",
    time: "30 minutes ago",
    icon: Package,
    status: "info",
  },
  {
    type: "customer",
    title: "Customer support ticket",
    description: "New ticket from Mike Johnson",
    time: "1 hour ago",
    icon: Users,
    status: "warning",
  },
]

const statusColors = {
  success: "bg-green-500",
  info: "bg-blue-500",
  error: "bg-red-500",
  warning: "bg-yellow-500",
}

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start gap-4 p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="relative">
                <div className="p-2 rounded-lg bg-muted">
                  <activity.icon className="h-4 w-4" />
                </div>
                <div
                  className={`absolute -top-1 -right-1 h-3 w-3 rounded-full ${statusColors[activity.status as keyof typeof statusColors]}`}
                />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-xs text-muted-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
