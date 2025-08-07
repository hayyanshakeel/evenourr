"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, ShoppingCart, Package, Users, CreditCard } from "lucide-react"
import { useEffect, useState } from "react"
import { useAdminAuth } from "@/hooks/useAdminAuth"

interface ActivityItem {
  type: string;
  title: string;
  description: string;
  time: string;
  icon: typeof ShoppingCart;
  status: "success" | "info" | "error" | "warning";
}

const statusColors = {
  success: "bg-green-500",
  info: "bg-blue-500",
  error: "bg-red-500",
  warning: "bg-yellow-500",
}

const iconMap = {
  order: ShoppingCart,
  product: Package,
  customer: Users,
  payment: CreditCard,
  default: Activity,
}

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const { makeAuthenticatedRequest, isReady, isAuthenticated } = useAdminAuth()

  useEffect(() => {
    async function fetchActivities() {
      if (!isReady) return;
      
      if (!isAuthenticated) {
        console.warn('User not authenticated for recent activity')
        setLoading(false)
        return;
      }

      try {
        const response = await makeAuthenticatedRequest('/api/hatsadmin/dashboard/stats')
        
        if (response.ok) {
          const data = await response.json()
          if (data.recentActivity) {
            const mappedActivities: ActivityItem[] = data.recentActivity.map((activity: any) => ({
              type: activity.type,
              title: activity.title,
              description: activity.description,
              time: activity.time,
              icon: iconMap[activity.icon as keyof typeof iconMap] || iconMap.default,
              status: activity.type === 'payment' ? 'error' : 
                      activity.type === 'order' ? 'success' : 
                      activity.type === 'customer' ? 'success' : 'info'
            }))
            setActivities(mappedActivities)
          }
        } else {
          console.error('Failed to fetch recent activities:', response.status)
        }
      } catch (error) {
        console.error('Failed to fetch recent activities:', error)
        // Fallback to empty state instead of dummy data
        setActivities([])
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [isReady, isAuthenticated])

  if (loading) {
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
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start gap-4 p-2.5 rounded-lg animate-pulse">
                <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No recent activity found</p>
            <p className="text-sm">Activity will appear here when customers interact with your store</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-start gap-4 p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="relative">
                  <div className="p-2 rounded-lg bg-muted">
                    <activity.icon className="h-4 w-4" />
                  </div>
                  <div
                    className={`absolute -top-1 -right-1 h-3 w-3 rounded-full ${statusColors[activity.status]}`}
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
        )}
      </CardContent>
    </Card>
  )
}
