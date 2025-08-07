// Test component to showcase the responsive admin layout
"use client"

import { useState } from "react"
import { AdminPageLayout } from "@/components/admin/admin-page-layout"
import { AdminStatsCard } from "@/components/admin/admin-stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Plus
} from "lucide-react"

// Demo data for testing
const demoStats = {
  totalProducts: 1234,
  totalCustomers: 567,
  totalOrders: 89,
  totalRevenue: 12345.67
}

const demoOrders = [
  { id: 1, customer: "John Doe", total: 99.99, status: "Completed", date: "2025-01-10" },
  { id: 2, customer: "Jane Smith", total: 149.99, status: "Processing", date: "2025-01-10" },
  { id: 3, customer: "Bob Johnson", total: 199.99, status: "Shipped", date: "2025-01-09" },
  { id: 4, customer: "Alice Brown", total: 79.99, status: "Pending", date: "2025-01-09" },
  { id: 5, customer: "Charlie Wilson", total: 299.99, status: "Completed", date: "2025-01-08" },
]

export default function ResponsiveTestPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)

  const handleExport = () => {
    console.log("Export clicked")
  }

  const handleAddOrder = () => {
    console.log("Add order clicked")
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-emerald-100 text-black border-emerald-200 !bg-emerald-100 !text-black'
      case 'processing': return 'bg-sky-100 text-black border-sky-200 !bg-sky-100 !text-black'
      case 'shipped': return 'bg-violet-100 text-black border-violet-200 !bg-violet-100 !text-black'
      case 'pending': return 'bg-amber-100 text-black border-amber-200 !bg-amber-100 !text-black'
      default: return 'bg-slate-100 text-black border-slate-200 !bg-slate-100 !text-black'
    }
  }

  const statsCards = (
    <>
      <AdminStatsCard
        title="Total Products"
        value={demoStats.totalProducts}
        icon={Package}
        color="text-blue-500"
        bgColor="bg-blue-50"
        borderColor="border-blue-200"
      />
      <AdminStatsCard
        title="Total Customers"
        value={demoStats.totalCustomers}
        icon={Users}
        color="text-green-500"
        bgColor="bg-green-50"
        borderColor="border-green-200"
      />
      <AdminStatsCard
        title="Total Orders"
        value={demoStats.totalOrders}
        icon={ShoppingCart}
        color="text-purple-500"
        bgColor="bg-purple-50"
        borderColor="border-purple-200"
      />
      <AdminStatsCard
        title="Total Revenue"
        value={formatPrice(demoStats.totalRevenue)}
        subtitle="This month"
        icon={DollarSign}
        color="text-orange-500"
        bgColor="bg-orange-50"
        borderColor="border-orange-200"
      />
    </>
  )

  const filteredOrders = demoOrders.filter(order =>
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AdminPageLayout
      title="Responsive Test Dashboard"
      subtitle="Testing mobile-responsive layout and modern loading states"
      searchPlaceholder="Search orders, customers..."
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      showFilters={true}
      showExport={true}
      onExport={handleExport}
      addButtonText="Add Order"
      onAdd={handleAddOrder}
      statsCards={statsCards}
      loading={loading}
    >
      <Card className="border-0 shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-lg font-semibold">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 px-6">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500 mb-4 max-w-sm mx-auto">
                {searchTerm 
                  ? "No orders match your search criteria. Try adjusting your search terms." 
                  : "Get started by creating your first order."
                }
              </p>
              {!searchTerm && (
                <Button onClick={handleAddOrder} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Order
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-semibold">Order ID</TableHead>
                    <TableHead className="font-semibold">Customer</TableHead>
                    <TableHead className="font-semibold">Total</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold hidden sm:table-cell">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell>
                        <div className="font-medium text-gray-900">#{order.id}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{order.customer}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{formatPrice(order.total)}</div>
                      </TableCell>
                      <TableCell>
                        <span 
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="text-sm text-gray-500">
                          {new Date(order.date).toLocaleDateString()}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test loading state button */}
      <Card className="border-0 shadow-sm mt-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Test Loading States</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button 
              onClick={() => {
                setLoading(true)
                setTimeout(() => setLoading(false), 3000)
              }}
              variant="outline"
            >
              Test Page Loading (3s)
            </Button>
            <Button 
              onClick={() => {
                // Simulate search loading
                setSearchTerm("test")
                setTimeout(() => setSearchTerm(""), 2000)
              }}
              variant="outline"
            >
              Test Search Loading
            </Button>
          </div>
        </CardContent>
      </Card>
    </AdminPageLayout>
  )
}
