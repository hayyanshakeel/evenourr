"use client"

import { PageHeader } from "@/components/admin/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Filter, 
  Download, 
  Plus, 
  Users, 
  UserPlus, 
  ShoppingBag, 
  DollarSign, 
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Mail
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const stats = [
  {
    title: "Total Customers",
    value: "2,847",
    change: "+156 this month",
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    title: "New Customers",
    value: "156",
    change: "+12% vs last month",
    icon: UserPlus,
    color: "text-green-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  {
    title: "Total Orders",
    value: "8,439",
    change: "Average 3.0 per customer",
    icon: ShoppingBag,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
  {
    title: "Total Revenue",
    value: "$284,392",
    change: "+23% vs last month",
    icon: DollarSign,
    color: "text-orange-500",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
]

const customers = [
  {
    id: "CST-001",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    orders: 12,
    totalSpent: "$1,234.56",
    lastOrder: "2024-01-15",
    status: "active",
    joinDate: "2023-06-15",
  },
  {
    id: "CST-002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 234-5678",
    orders: 8,
    totalSpent: "$876.43",
    lastOrder: "2024-01-12",
    status: "active",
    joinDate: "2023-08-22",
  },
  {
    id: "CST-003",
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    phone: "+1 (555) 345-6789",
    orders: 3,
    totalSpent: "$432.10",
    lastOrder: "2024-01-08",
    status: "inactive",
    joinDate: "2023-11-05",
  },
  {
    id: "CST-004",
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    phone: "+1 (555) 456-7890",
    orders: 25,
    totalSpent: "$2,567.89",
    lastOrder: "2024-01-14",
    status: "active",
    joinDate: "2023-03-10",
  },
]

const statusColors = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  pending: "bg-yellow-100 text-yellow-800",
}

function CustomersActions() {
  return (
    <div className="flex items-center gap-2 lg:gap-3">
      <Button
        variant="outline"
        size="sm"
        className="bg-white border-gray-200 text-black hover:bg-gray-50"
      >
        <Filter className="h-4 w-4 mr-2 text-black" />
        Filter
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="bg-white border-gray-200 text-black hover:bg-gray-50"
      >
        <Download className="h-4 w-4 mr-2 text-black" />
        Export
      </Button>
      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
        <Plus className="h-4 w-4 mr-2" />
        Add Customer
      </Button>
    </div>
  )
}

export default function CustomersPage() {
  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <PageHeader 
        title="Customers" 
        subtitle="Manage your customer database and relationships"
        showSearch={true}
        showFilters={true}
        showAddButton={true}
        addButtonText="Add Customer"
      />

      <main className="flex-1 overflow-auto">
        <div className="p-4 lg:p-6 xl:p-8 space-y-6 lg:space-y-8">
          
          {/* Stats Grid */}
          <div className="grid gap-4 md:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <Card
                  key={stat.title}
                  className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border ${stat.borderColor}`}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <IconComponent className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </div>
                    <p className="text-xs text-gray-500">
                      {stat.change}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input placeholder="Search customers..." className="w-full lg:w-80 pl-10" />
            </div>
          </div>

          {/* Customers Table */}
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle>All Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Last Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <Users className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-gray-500">ID: {customer.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="flex items-center text-sm">
                            <Mail className="h-4 w-4 mr-1 text-gray-400" />
                            {customer.email}
                          </div>
                          <div className="text-sm text-gray-500">{customer.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{customer.orders}</TableCell>
                      <TableCell className="font-semibold">{customer.totalSpent}</TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(customer.lastOrder).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[customer.status as keyof typeof statusColors]}>
                          {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(customer.joinDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View profile</DropdownMenuItem>
                              <DropdownMenuItem>Order history</DropdownMenuItem>
                              <DropdownMenuItem>Send email</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
