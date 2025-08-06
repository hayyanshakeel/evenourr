"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, Clock, Truck, CheckCircle } from "lucide-react"

const stats = [
  {
    title: "Total Orders",
    value: "1,429",
    icon: ShoppingCart,
    color: "text-blue-600",
  },
  {
    title: "Pending",
    value: "89",
    icon: Clock,
    color: "text-yellow-600",
  },
  {
    title: "In Transit",
    value: "234",
    icon: Truck,
    color: "text-purple-600",
  },
  {
    title: "Delivered",
    value: "1,106",
    icon: CheckCircle,
    color: "text-green-600",
  },
]

export function OrdersStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
