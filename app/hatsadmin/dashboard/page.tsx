import { PageHeader } from "@/components/admin/page-header"
import { DashboardMetrics } from "@/components/admin/dashboard-metrics"
import { RecentActivity } from "@/components/admin/recent-activity"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full w-full">
      <PageHeader 
        title="Dashboard" 
        subtitle="Welcome back! Here's what's happening with your store today." 
      />
      <div className="flex-1 overflow-auto">
        <div className="space-y-6">
          <DashboardMetrics />
          <div className="grid gap-6 lg:gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6 lg:space-y-8">
              <RecentActivity />
            </div>
            <div className="space-y-6 lg:space-y-8">
              <Card className="card-hover admin-card">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="font-semibold">Add New Product</div>
                    <div className="text-sm text-gray-500">Create a new product listing</div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-semibold">Process Orders</div>
                    <div className="text-sm text-gray-500">Review pending orders</div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-semibold">Inventory Check</div>
                    <div className="text-sm text-gray-500">Monitor stock levels</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
