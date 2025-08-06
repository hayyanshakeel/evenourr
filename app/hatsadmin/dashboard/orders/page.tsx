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

interface OrderStats {
  total: number;
  pending: number;
  shipped: number;
  cancelled: number;
}

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [stats, setStats] = useState<OrderStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  console.log('Orders page state:', { 
    ordersCount: orders.length, 
    searchQuery, 
    statusFilter, 
    filteredCount: orders.filter(order => {
      const customerName = order.customer?.name || (order.user ? `${order.user.firstName} ${order.user.lastName}` : '')
      const customerEmail = order.customer?.email || order.user?.email || ''
      const matchesSearch = searchQuery === '' || 
                           customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           order.id.toString().includes(searchQuery)
      const matchesStatus = statusFilter === "all" || order.status === statusFilter
      return matchesSearch && matchesStatus
    }).length 
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const [ordersResponse, statsResponse] = await Promise.all([
          fetch('/api/admin/orders'),
          fetch('/api/admin/orders/stats')
        ])

        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json()
          setOrders(ordersData.orders || ordersData)
        }

        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setStats(statsData)
        }
      } catch (error) {
        console.error('Failed to fetch orders data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleAddOrder = () => {
    router.push("/hatsadmin/dashboard/orders/add")
  }

  const filteredOrders = orders.filter(order => {
    const customerName = order.customer?.name || (order.user ? `${order.user.firstName} ${order.user.lastName}` : '')
    const customerEmail = order.customer?.email || order.user?.email || ''
    const matchesSearch = searchQuery === '' || 
                         customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.id.toString().includes(searchQuery)
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    
    console.log('Filter debug:', { 
      orderId: order.id, 
      searchQuery, 
      statusFilter, 
      customerName, 
      customerEmail, 
      matchesSearch, 
      matchesStatus,
      orderStatus: order.status 
    });
    
    return matchesSearch && matchesStatus
  })

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
          
          {/* Header Actions */}
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search orders..." 
                className="w-full lg:w-80 pl-10"
                value={searchQuery}
                onChange={(e) => {
                  console.log('Search input changed:', e.target.value);
                  setSearchQuery(e.target.value);
                }}
              />
            </div>

            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <HiOutlineFilter className="h-4 w-4 mr-2" />
                    Filter {statusFilter !== "all" && `(${statusFilter})`}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => {
                    console.log('Filter changed to: all');
                    setStatusFilter("all");
                  }}>
                    All Statuses
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    console.log('Filter changed to: pending');
                    setStatusFilter("pending");
                  }}>
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    console.log('Filter changed to: processing');
                    setStatusFilter("processing");
                  }}>
                    Processing
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    console.log('Filter changed to: paid');
                    setStatusFilter("paid");
                  }}>
                    Paid
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    console.log('Filter changed to: shipped');
                    setStatusFilter("shipped");
                  }}>
                    Shipped
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    console.log('Filter changed to: delivered');
                    setStatusFilter("delivered");
                  }}>
                    Delivered
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    console.log('Filter changed to: cancelled');
                    setStatusFilter("cancelled");
                  }}>
                    Cancelled
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="sm">
                <HiOutlineArrowDownTray className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="black" size="sm" onClick={handleAddOrder}>
                <HiOutlinePlus className="h-4 w-4 mr-2" />
                Create Order
              </Button>
            </div>
          </div>

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
                      const customerName = order.customer?.name || (order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Unknown Customer')
                      const customerEmail = order.customer?.email || order.user?.email || ''
                      
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
                              {order.orderItems.length} items
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
