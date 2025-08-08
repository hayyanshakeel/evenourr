"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminPageLayout } from "@/components/admin/admin-page-layout"
import { AdminStatsCard } from "@/components/admin/admin-stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Users, 
  UserPlus, 
  ShoppingBag, 
  DollarSign,
  MoreHorizontal,
  Edit,
  Trash2,
  Mail,
  Plus
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useSettings } from "@/hooks/useSettings"
import { formatCurrency as formatCurrencyUtil } from "@/lib/currencies"

interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  createdAt: string | Date;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string | Date;
  status: string;
  segment: string;
  lifetimeValue?: number;
  averageOrderValue?: number;
  riskScore?: number;
  churnProbability?: number;
  engagement?: number;
  _count?: {
    orders: number;
  };
}

interface CustomerStats {
  totalCustomers: number;
  activeCustomers: number;
  newThisMonth: number;
  totalRevenue: number;
  averageOrderValue: number;
  customerLifetimeValue: number;
  churnRate: number;
  retentionRate: number;
  segments: {
    new: number;
    developing: number;
    loyal: number;
    VIP: number;
    inactive: number;
  };
  monthlyGrowth: {
    customers: number;
    revenue: number;
    orders: number;
  };
  topMetrics: Array<{
    label: string;
    value: string;
    change: number;
    trend: string;
  }>;
}

export default function CustomersPage() {
  const router = useRouter()
  const { currency } = useSettings()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [stats, setStats] = useState<CustomerStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [filtering, setFiltering] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    if (!loading) {
      setFiltering(true)
    }
    fetchData()
  }, [debouncedSearchQuery])

  async function fetchData() {
    try {
      if (!loading) setFiltering(true)
      if (loading) setLoading(true)
      
      const params = new URLSearchParams()
      if (debouncedSearchQuery.trim()) {
        params.append('search', debouncedSearchQuery.trim())
      }
      
      // Use real APIs with proper error handling
      const [customersResponse, statsResponse] = await Promise.all([
        fetch(`/api/customers?${params}`).catch(() => null),
        fetch('/api/customers/stats').catch(() => null)
      ])

      if (customersResponse && customersResponse.ok) {
        const customersData = await customersResponse.json()
        // Ensure we always have an array, with proper fallback
        const customersArray = customersData?.customers || customersData || []
        setCustomers(Array.isArray(customersArray) ? customersArray : [])
      } else {
        console.error('Failed to fetch customers:', customersResponse?.status)
        setCustomers([]) // Fallback to empty array
      }

      if (statsResponse && statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData || null)
      } else {
        console.error('Failed to fetch stats:', statsResponse?.status)
        setStats(null) // Fallback to null
      }
    } catch (error) {
      console.error('Failed to fetch customers data:', error)
      // Ensure we have fallback values in case of error
      setCustomers([])
      setStats(null)
    } finally {
      setLoading(false)
      setFiltering(false)
    }
  }

  const handleAddCustomer = () => {
    router.push("/hatsadmin/dashboard/customers/new")
  }

  const handleEditCustomer = (id: number) => {
    router.push(`/hatsadmin/dashboard/customers/${id}/edit`)
  }

  const handleViewCustomer = (id: number) => {
    router.push(`/hatsadmin/dashboard/customers/${id}`)
  }

  const handleDeleteCustomer = async (id: number) => {
    if (!confirm('Are you sure you want to delete this customer?')) {
      return
    }

    try {
      // Demo: Just remove from local state instead of making API call
      setCustomers(prevCustomers => prevCustomers.filter(customer => customer.id !== id))
      alert('Customer deleted successfully (demo mode)')
    } catch (error) {
      console.error('Failed to delete customer:', error)
      alert('Failed to delete customer')
    }
  }

  const handleExport = async () => {
    try {
      // Demo: Create a simple CSV export
      const csvContent = [
        'ID,Name,Email,Total Orders,Total Spent,Status,Segment',
        ...customers.map(customer => 
          `${customer.id},"${customer.name}","${customer.email}",${customer.totalOrders},${customer.totalSpent},${customer.status},${customer.segment}`
        )
      ].join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `customers-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Failed to export customers:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatCurrency = (amount: number) => {
    return formatCurrencyUtil(amount, currency)
  }

  const renderStatsCards = () => {
    if (!stats) {
      return (
        <>
          <AdminStatsCard
            title="Total Customers"
            value="Loading..."
            subtitle="Calculating..."
            icon={Users}
            color="text-blue-500"
            bgColor="bg-blue-50"
            borderColor="border-blue-200"
          />
          <AdminStatsCard
            title="New This Month"
            value="Loading..."
            subtitle="Calculating..."
            icon={UserPlus}
            color="text-green-500"
            bgColor="bg-green-50"
            borderColor="border-green-200"
          />
          <AdminStatsCard
            title="Average Order Value"
            value="Loading..."
            subtitle="Calculating..."
            icon={ShoppingBag}
            color="text-purple-500"
            bgColor="bg-purple-50"
            borderColor="border-purple-200"
          />
          <AdminStatsCard
            title="Total Revenue"
            value="Loading..."
            subtitle="Calculating..."
            icon={DollarSign}
            color="text-orange-500"
            bgColor="bg-orange-50"
            borderColor="border-orange-200"
          />
        </>
      )
    }

    return (
      <>
        <AdminStatsCard
          title="Total Customers"
          value={stats.totalCustomers?.toLocaleString() || '0'}
          subtitle={`${stats.activeCustomers || 0} active`}
          icon={Users}
          color="text-blue-500"
          bgColor="bg-blue-50"
          borderColor="border-blue-200"
        />
        <AdminStatsCard
          title="New This Month"
          value={stats.newThisMonth?.toLocaleString() || '0'}
          subtitle="New customers"
          icon={UserPlus}
          color="text-green-500"
          bgColor="bg-green-50"
          borderColor="border-green-200"
        />
        <AdminStatsCard
          title="Average Order Value"
          value={formatCurrency(stats.averageOrderValue || 0)}
          subtitle={`LTV: ${formatCurrency(stats.customerLifetimeValue || 0)}`}
          icon={ShoppingBag}
          color="text-purple-500"
          bgColor="bg-purple-50"
          borderColor="border-purple-200"
        />
        <AdminStatsCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue || 0)}
          subtitle={`${stats.retentionRate || 0}% retention rate`}
          icon={DollarSign}
          color="text-orange-500"
          bgColor="bg-orange-50"
          borderColor="border-orange-200"
        />
      </>
    )
  }

  return (
    <AdminPageLayout
      title="Customers"
      subtitle="Manage your customer database and relationships"
      searchPlaceholder="Search customers..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      showFilters={true}
      showExport={true}
      onExport={handleExport}
      addButtonText="Add Customer"
      onAdd={handleAddCustomer}
      statsCards={renderStatsCards()}
      loading={loading}
    >
      <Card className="admin-card">
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
        </CardHeader>
        <CardContent>
          {customers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery 
                  ? "No customers match your search criteria." 
                  : "Get started by adding your first customer."
                }
              </p>
              {!searchQuery && (
                <Button onClick={handleAddCustomer}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Customer
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-gray-400" />
                        </div>
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-gray-500">ID: {customer.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{customer.email}</div>
                        {customer.phone && (
                          <div className="text-sm text-gray-500">{customer.phone}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {customer._count?.orders || 0} orders
                      </span>
                    </TableCell>
                    <TableCell>
                      {formatDate(customer.createdAt instanceof Date ? customer.createdAt.toISOString() : customer.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewCustomer(customer.id)}>
                            <Users className="h-4 w-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditCustomer(customer.id)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteCustomer(customer.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </AdminPageLayout>
  )
}


