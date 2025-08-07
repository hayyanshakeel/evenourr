"use client"

import { MobileHeader } from "@/components/admin/mobile-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Filter, 
  Download, 
  Plus, 
  Tag, 
  Percent, 
  Users, 
  DollarSign, 
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Calendar
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const stats = [
  {
    title: "Total Coupons",
    value: "32",
    change: "+4 this month",
    icon: Tag,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    title: "Active Coupons",
    value: "18",
    change: "56% active",
    icon: Percent,
    color: "text-green-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  {
    title: "Total Uses",
    value: "1,247",
    change: "This month",
    icon: Users,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
  {
    title: "Discount Value",
    value: "$8,439",
    change: "+15% vs last month",
    icon: DollarSign,
    color: "text-orange-500",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
]

const coupons = [
  {
    id: "CPN-001",
    code: "SUMMER25",
    name: "Summer Sale",
    description: "25% off all summer items",
    type: "percentage",
    value: "25%",
    minOrder: "$50",
    uses: 234,
    maxUses: 500,
    status: "active",
    expires: "2024-09-30",
    created: "2024-06-01",
  },
  {
    id: "CPN-002",
    code: "NEWUSER15",
    name: "New Customer Discount",
    description: "15% off for first-time buyers",
    type: "percentage",
    value: "15%",
    minOrder: "$30",
    uses: 89,
    maxUses: 1000,
    status: "active",
    expires: "2024-12-31",
    created: "2024-05-15",
  },
  {
    id: "CPN-003",
    code: "FREESHIP",
    name: "Free Shipping",
    description: "Free shipping on orders over $75",
    type: "shipping",
    value: "Free",
    minOrder: "$75",
    uses: 156,
    maxUses: 200,
    status: "active",
    expires: "2024-08-31",
    created: "2024-07-01",
  },
  {
    id: "CPN-004",
    code: "WELCOME10",
    name: "Welcome Discount",
    description: "10% off your first order",
    type: "percentage",
    value: "10%",
    minOrder: "$25",
    uses: 445,
    maxUses: 1000,
    status: "expired",
    expires: "2024-01-31",
    created: "2024-01-01",
  },
]

const statusColors = {
  active: "bg-emerald-100 text-black !bg-emerald-100 !text-black",
  expired: "bg-rose-100 text-black !bg-rose-100 !text-black",
  paused: "bg-amber-100 text-black !bg-amber-100 !text-black",
}

function CouponsActions() {
  return (
    <div className="flex items-center gap-2 lg:gap-3">
      <Button
        variant="outline"
        size="sm"
        className="bg-black border-black text-white hover:bg-gray-800"
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
        Create Coupon
      </Button>
    </div>
  )
}

export default function CouponsPage() {
  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <MobileHeader 
        title="Coupons" 
        subtitle="Manage discount codes and promotional offers" 
        actions={<CouponsActions />} 
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
              <Input placeholder="Search coupons..." className="w-full lg:w-80 pl-10" />
            </div>
          </div>

          {/* Coupons Table */}
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle>All Coupons</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Coupon</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Uses</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coupons.map((coupon) => (
                    <TableRow key={coupon.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center">
                            <Tag className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <div className="font-medium">{coupon.name}</div>
                            <div className="text-sm text-gray-500">
                              <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{coupon.code}</code>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                          {coupon.type}
                        </span>
                      </TableCell>
                      <TableCell className="font-semibold">{coupon.value}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{coupon.uses}</div>
                          <div className="text-gray-500">of {coupon.maxUses}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[coupon.status as keyof typeof statusColors]}>
                          {coupon.status.charAt(0).toUpperCase() + coupon.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(coupon.expires).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Copy className="h-4 w-4" />
                          </Button>
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
                              <DropdownMenuItem>View details</DropdownMenuItem>
                              <DropdownMenuItem>Usage analytics</DropdownMenuItem>
                              <DropdownMenuItem>Duplicate</DropdownMenuItem>
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
