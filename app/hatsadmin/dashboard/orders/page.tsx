"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { PageHeader } from "@/components/admin/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { HiFunnel as HiOutlineFilter, HiArrowDownTray as HiOutlineArrowDownTray, HiPlus as HiOutlinePlus, HiShoppingCart as HiOutlineShoppingCart, HiClock as HiOutlineClock, HiTruck as HiOutlineTruck, HiCheckCircle as HiOutlineCheckCircle, HiEye as HiOutlineEye, HiEllipsisHorizontal as HiOutlineEllipsisHorizontal, HiMagnifyingGlass as Search } from "react-icons/hi2"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AdminOrder } from "@/lib/admin-data"
import { useAdminAuth } from "@/hooks/useAdminAuth"

interface OrderStats {
  total: number;
  pending: number;
  shipped: number;
  cancelled: number;
}

export default function OrdersPage() {
  const router = useRouter()
  const { makeAuthenticatedRequest, isReady, isAuthenticated } = useAdminAuth()
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [stats, setStats] = useState<OrderStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [filtering, setFiltering] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    // Only fetch when filters actually change and user is authenticated
    if (isReady && isAuthenticated) {
      fetchData()
    }
  }, [statusFilter, debouncedSearchQuery, isReady, isAuthenticated])

  async function fetchData() {
    try {
      if (!loading) setFiltering(true) // Show filtering state for subsequent calls
      if (loading) setLoading(true) // Show loading state for initial call
      
      // Build query parameters for filtering
      const params = new URLSearchParams()
      if (statusFilter !== 'all') {
        params.append('status', statusFilter)
      }
      if (debouncedSearchQuery.trim()) {
        params.append('search', debouncedSearchQuery.trim())
      }
      
      const [ordersResponse, statsResponse] = await Promise.all([
        makeAuthenticatedRequest(`/api/admin/orders?${params}`),
        makeAuthenticatedRequest('/api/admin/orders/stats')
      ])

      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json()
        // Ensure we always have an array, with proper fallback
        const ordersArray = ordersData?.orders || ordersData || []
        setOrders(Array.isArray(ordersArray) ? ordersArray : [])
      } else {
        console.error('Failed to fetch orders:', ordersResponse.status)
        setOrders([]) // Fallback to empty array
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      } else {
        console.error('Failed to fetch stats:', statsResponse.status)
        setStats(null) // Fallback to null
      }
    } catch (error) {
      console.error('Failed to fetch orders data:', error)
      // Ensure we have fallback values in case of error
      setOrders([])
      setStats(null)
    } finally {
      setLoading(false)
      setFiltering(false)
    }
  }

  const handleAddOrder = () => {
    router.push("/hatsadmin/dashboard/orders/add")
  }

  const handleExport = () => {
    // Ensure orders is an array before exporting
    if (!Array.isArray(orders) || orders.length === 0) {
      console.warn('No orders available to export')
      return
    }
    
    // Export orders to CSV
    const headers = ['Order ID', 'Customer', 'Total', 'Status', 'Date', 'Items']
    const csvData = orders.map(order => {
      let customerName = 'Unknown Customer';
      if (order.customer) {
        customerName = order.customer.name;
      } else if (order.user) {
        customerName = `${order.user.firstName} ${order.user.lastName}`.trim();
      }
      return [
        order.id,
        customerName,
        order.totalPrice,
        order.status,
        new Date(order.createdAt).toLocaleDateString(),
        order.orderItems?.length || 0
      ]
    })
    
    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'orders.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  // Since we're filtering on the server side, we can use orders directly
  // Ensure filteredOrders is always an array
  const filteredOrders = Array.isArray(orders) ? orders : []

  const statsCards = stats ? [
    {
      title: "Total Orders",
      value: stats.total.toString(),
      icon: HiOutlineShoppingCart,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Pending",
      value: stats.pending.toString(),
      icon: HiOutlineClock,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
    {
      title: "Shipped",
      value: stats.shipped.toString(),
      icon: HiOutlineTruck,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      title: "Cancelled",
      value: stats.cancelled.toString(),
      icon: HiOutlineCheckCircle,
      color: "text-red-500",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
  ] : []

  const statusColors: { [key: string]: string } = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    paid: "bg-green-100 text-green-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  }

  if (loading) {
    return (
      <div className="flex flex-col h-full w-full">
        <PageHeader 
          title="Orders" 
          subtitle="Manage customer orders and fulfillment"
          showSearch={true}
          showFilters={true}
          showAddButton={true}
          addButtonText="Create Order"
          onAdd={handleAddOrder}
        />
        
        <main className="flex-1 overflow-auto">
          <div className="space-y-6 lg:space-y-8">
            
            {/* Stats Grid - Loading */}
            <div className="grid gap-4 md:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="admin-card animate-pulse">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Orders Table - Loading */}
            <Card className="admin-card">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 p-4 border rounded animate-pulse">
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div className="bg-white border-b border-gray-200 shadow-sm mb-6">
        <div className="px-4 lg:px-6 xl:px-8 py-6 lg:py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
            
            {/* Title Section */}
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                Orders
              </h1>
              <p className="mt-2 text-sm lg:text-base text-gray-600 leading-relaxed">
                Manage customer orders and fulfillment
              </p>
            </div>

            {/* Actions Section */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search orders..." 
                  className="w-full lg:w-80 pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={loading}
                />
              </div>

              {/* Horizontally scrollable actions for mobile, inline for desktop */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-2 px-2 sm:mx-0 sm:px-0 lg:overflow-visible lg:py-0 lg:mx-0 lg:px-0 sm:gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" disabled={filtering}>
                      <HiOutlineFilter className="h-4 w-4 mr-2" />
                      {filtering ? 'Filtering...' : `Filter ${statusFilter !== "all" ? `(${statusFilter})` : ''}`}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setStatusFilter("all")}> 
                      All Statuses
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("pending")}> 
                      Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("processing")}> 
                      Processing
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("paid")}> 
                      Paid
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("shipped")}> 
                      Shipped
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("delivered")}> 
                      Delivered
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("cancelled")}> 
                      Cancelled
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("fulfilled")}> 
                      Fulfilled
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline" size="sm" className="px-2 sm:px-3" onClick={handleExport}>
                  <HiOutlineArrowDownTray className="h-4 w-4" />
                  <span className="ml-1 sm:ml-2 text-xs sm:text-sm">Export</span>
                </Button>
                <Button variant="black" size="sm" onClick={handleAddOrder} className="px-2 sm:px-3">
                  <HiOutlinePlus className="h-4 w-4" />
                  <span className="ml-1 sm:ml-2 text-xs sm:text-sm">Create Order</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <main className="flex-1 overflow-auto">
        <div className="space-y-6 lg:space-y-8">

          {/* Stats Grid */}
          {stats && (
            <div className="grid gap-4 md:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {statsCards.map((stat, index) => {
                const IconComponent = stat.icon
                return (
                  <Card
                    key={stat.title}
                    className={`admin-card relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${stat.borderColor}`}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {stat.title}
                      </CardTitle>
                      <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                        <IconComponent className={`h-4 w-4 ${stat.color}`} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {stat.value}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Orders List */}
          <Card className="admin-card">
            <CardHeader>
              <CardTitle>Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <HiOutlineShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No orders available</h3>
                  <p className="text-gray-500 mb-4">
                    {orders.length === 0 
                      ? "Orders will appear here once customers start purchasing." 
                      : "No orders match your search criteria."
                    }
                  </p>
                  {orders.length === 0 && (
                    <Button onClick={handleAddOrder}>
                      <HiOutlinePlus className="h-4 w-4 mr-2" />
                      Create First Order
                    </Button>
                  )}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => {
                      // Better customer name logic
                      let customerName = 'Unknown Customer';
                      let customerEmail = '';
                      
                      if (order.customer) {
                        customerName = order.customer.name;
                        customerEmail = order.customer.email;
                      } else if (order.user) {
                        customerName = `${order.user.firstName} ${order.user.lastName}`.trim();
                        customerEmail = order.user.email;
                      }
                      
                      return (
                        <TableRow key={order.id}>
                          <TableCell>
                            <span className="font-mono text-sm">#{order.id}</span>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{customerName}</div>
                              <div className="text-sm text-gray-500">{customerEmail}</div>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold">₹{order.totalPrice}</TableCell>
                          <TableCell>
                            <Badge 
                              variant="secondary"
                              className={statusColors[order.status] || 'bg-gray-100 text-gray-800'}
                            >
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-600">
                              {order.orderItems?.length || 0} items
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <HiOutlineEllipsisHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => router.push(`/hatsadmin/dashboard/orders/${order.id}`)}>
                                  <HiOutlineEye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Update Status
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  Cancel Order
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
