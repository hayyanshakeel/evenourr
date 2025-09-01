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
import { useSettings } from "@/hooks/useSettings"
import { formatCurrency } from "@/lib/currencies"
import { secureAdminApi } from '@/lib/secure-admin-api';

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
  const { currency } = useSettings()

  // Debug authentication state
  console.log('[Orders] Auth state:', { isReady, isAuthenticated });

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    // Only fetch data when authenticated and ready
    if (isReady && isAuthenticated) {
      fetchData()
    }
  }, [isReady, isAuthenticated, statusFilter, debouncedSearchQuery])

  async function fetchData() {
    try {
      if (!loading) setFiltering(true) // Show filtering state for subsequent calls
      if (loading) setLoading(true) // Show loading state for initial call
      
      // Build query parameters for filtering
      const params: any = {}
      if (statusFilter !== 'all') params.status = statusFilter
      if (debouncedSearchQuery.trim()) params.search = debouncedSearchQuery.trim()
      
      // Use parallel requests with timeout for better performance
      const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      );
      
      const [ordersRes, statsRes] = await Promise.race([
        Promise.all([
          secureAdminApi.getOrders(params),
          secureAdminApi.getOrderStats()
        ]),
        timeout
      ]) as any[];

      if (ordersRes.success) {
        const payload: any = (ordersRes as any).data || ordersRes
        // Ensure we always have an array, with proper fallback
        const rawOrders = payload.orders || payload.data || payload || []
        
        // Map the API response to match the expected AdminOrder interface
        const mappedOrders = Array.isArray(rawOrders) ? rawOrders.map((order: any) => ({
          ...order,
          totalPrice: order.amount || order.totalPrice || 0, // Map amount to totalPrice
          orderItems: order.items || order.orderItems || [], // Map items to orderItems
        })) : []
        
        setOrders(mappedOrders)
      } else {
        setOrders([]) // Fallback to empty array
      }

      if (statsRes.success) {
        const statsData: any = (statsRes as any).data || statsRes
        
        // Map the API response to match the expected OrderStats interface
        const mappedStats = {
          total: statsData.totalOrders || statsData.total || 0,
          pending: statsData.pendingOrders || statsData.pending || 0,
          shipped: statsData.shippedOrders || statsData.shipped || 0,
          cancelled: statsData.cancelledOrders || statsData.cancelled || 0,
        }
        
        setStats(mappedStats)
      } else {
        setStats(null) // Fallback to null
      }
    } catch (error) {
      console.error('Failed to fetch orders data via gateway:', error)
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
        (order as any).id || (order as any).orderNumber,
        customerName,
        order.totalPrice || (order as any).amount || 0,
        order.status,
        new Date(order.createdAt).toLocaleDateString(),
        (order.orderItems?.length || (order as any).items?.length || 0)
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

  const safeTotals = {
    total: stats?.total ?? 0,
    pending: stats?.pending ?? 0,
    shipped: stats?.shipped ?? 0,
    cancelled: stats?.cancelled ?? 0,
  }

  const statsCards = stats ? [
    {
      title: "Total Orders",
      value: String(safeTotals.total),
      icon: HiOutlineShoppingCart,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Pending",
      value: String(safeTotals.pending),
      icon: HiOutlineClock,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
    {
      title: "Shipped",
      value: String(safeTotals.shipped),
      icon: HiOutlineTruck,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      title: "Cancelled",
      value: String(safeTotals.cancelled),
      icon: HiOutlineCheckCircle,
      color: "text-red-500",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
  ] : []

  const statusColors: { [key: string]: string } = {
    pending: "bg-amber-100 text-black !bg-amber-100 !text-black",
    processing: "bg-sky-100 text-black !bg-sky-100 !text-black",
    paid: "bg-emerald-100 text-black !bg-emerald-100 !text-black",
    shipped: "bg-violet-100 text-black !bg-violet-100 !text-black",
    delivered: "bg-emerald-100 text-black !bg-emerald-100 !text-black",
    cancelled: "bg-rose-100 text-black !bg-rose-100 !text-black",
  }

  async function updateOrderStatus(orderId: number, nextStatus: string) {
    if (!isAuthenticated) {
      alert('Please log in to update order status');
      return;
    }
    
    try {
      const res = await secureAdminApi.updateOrderStatus(String(orderId), nextStatus)
      if (!res.success) throw new Error(res.error || 'Failed to update status')
      await fetchData()
    } catch (err) {
      console.error('updateOrderStatus failed', err)
      alert(err instanceof Error ? err.message : 'Failed to update status')
    }
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
        
        <main className="flex-1 overflow-auto px-3 sm:px-4 lg:px-6">
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            
            {/* Stats Grid - Loading */}
            <div className="grid gap-3 sm:gap-4 md:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="admin-card animate-pulse">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3 p-3 sm:p-4 lg:p-6">
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-20 sm:w-24"></div>
                    <div className="h-6 w-6 sm:h-8 sm:w-8 bg-gray-200 rounded"></div>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
                    <div className="h-6 sm:h-8 bg-gray-200 rounded w-16 sm:w-20 mb-1 sm:mb-2"></div>
                    <div className="h-2 sm:h-3 bg-gray-200 rounded w-12 sm:w-16"></div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Orders Table - Loading */}
            <Card className="admin-card">
              <CardHeader className="p-3 sm:p-4 lg:p-6">
                <div className="h-5 sm:h-6 bg-gray-200 rounded w-24 sm:w-32 animate-pulse"></div>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
                <div className="space-y-3 sm:space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 border rounded animate-pulse">
                      <div className="flex-1 space-y-1 sm:space-y-2">
                        <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-2 sm:h-3 bg-gray-200 rounded w-1/2"></div>
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
      <div className="bg-white border-b border-gray-200 shadow-sm mb-4 sm:mb-6">
        <div className="px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4 lg:gap-6">
            
            {/* Title Section */}
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                Orders
              </h1>
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed">
                Manage customer orders and fulfillment
              </p>
            </div>

            {/* Actions Section */}
            <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative">
                <Search className="absolute left-2 sm:left-3 top-1/2 h-3 w-3 sm:h-4 sm:w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search orders..." 
                  className="w-full lg:w-80 pl-8 sm:pl-10 text-sm sm:text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={loading}
                />
              </div>

              {/* Horizontally scrollable actions for mobile, inline for desktop */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-1 px-1 sm:mx-0 sm:px-0 lg:overflow-visible lg:py-0 lg:mx-0 lg:px-0 sm:gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" disabled={filtering} className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3">
                      <HiOutlineFilter className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">{filtering ? 'Filtering...' : `Filter ${statusFilter !== "all" ? `(${statusFilter})` : ''}`}</span>
                      <span className="sm:hidden">Filter</span>
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
                <Button variant="outline" size="sm" className="flex-shrink-0 px-2 sm:px-3 text-xs sm:text-sm" onClick={handleExport}>
                  <HiOutlineArrowDownTray className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="ml-1 sm:ml-2">Export</span>
                </Button>
                <Button variant="black" size="sm" onClick={handleAddOrder} className="flex-shrink-0 px-2 sm:px-3 text-xs sm:text-sm">
                  <HiOutlinePlus className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="ml-1 sm:ml-2 hidden sm:inline">Create Order</span>
                  <span className="ml-1 sm:hidden">Add</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <main className="flex-1 overflow-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">

          {/* Stats Grid */}
          {stats && (
            <div className="grid gap-3 sm:gap-4 md:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {statsCards.map((stat, index) => {
                const IconComponent = stat.icon
                return (
                  <Card
                    key={stat.title}
                    className={`admin-card relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${stat.borderColor}`}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3 p-3 sm:p-4 lg:p-6">
                      <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                        {stat.title}
                      </CardTitle>
                      <div className={`p-1.5 sm:p-2 rounded-lg ${stat.bgColor}`}>
                        <IconComponent className={`h-3 w-3 sm:h-4 sm:w-4 ${stat.color}`} />
                      </div>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
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
            <CardHeader className="p-3 sm:p-4 lg:p-6">
              <CardTitle className="text-base sm:text-lg">Orders</CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <HiOutlineShoppingCart className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">No orders available</h3>
                  <p className="text-sm sm:text-base text-gray-500 mb-3 sm:mb-4">
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
                          <TableCell className="font-semibold">{formatCurrency(order.totalPrice, currency)}</TableCell>
                          <TableCell>
                            <Badge 
                              variant="secondary"
                              className={statusColors[order.status] || 'bg-slate-100 text-black !bg-slate-100 !text-black'}
                            >
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-600">
                              {(order.orderItems?.length || (order as any).items?.length || 0)} items
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
                                <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'processing')}>Mark Processing</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'paid')}>Mark Paid</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'shipped')}>Mark Shipped</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'delivered')}>Mark Delivered</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600" onClick={() => {
                                  if (confirm('Are you sure you want to cancel this order?')) {
                                    updateOrderStatus(order.id, 'cancelled')
                                  }
                                }}>
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
