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
  Layers, 
  TrendingUp, 
  Package, 
  Eye, 
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Calendar
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const stats = [
  {
    title: "Total Collections",
    value: "24",
    change: "+3 this month",
    icon: Layers,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    title: "Active Collections",
    value: "18",
    change: "75% active",
    icon: TrendingUp,
    color: "text-green-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  {
    title: "Total Products",
    value: "2,847",
    change: "In collections",
    icon: Package,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
  {
    title: "Views This Month",
    value: "45,623",
    change: "+12% vs last month",
    icon: Eye,
    color: "text-orange-500",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
]

const collections = [
  {
    id: "COL-001",
    name: "Summer Collection",
    description: "Light and breathable caps for summer",
    products: 45,
    status: "active",
    visibility: "published",
    created: "2024-01-15",
    sales: 234,
  },
  {
    id: "COL-002",
    name: "Winter Essentials",
    description: "Warm beanies and winter hats",
    products: 28,
    status: "active",
    visibility: "published",
    created: "2024-01-10",
    sales: 156,
  },
  {
    id: "COL-003",
    name: "Premium Line",
    description: "High-end luxury caps and accessories",
    products: 12,
    status: "active",
    visibility: "published",
    created: "2024-01-05",
    sales: 89,
  },
  {
    id: "COL-004",
    name: "Sports Collection",
    description: "Athletic caps for sports enthusiasts",
    products: 36,
    status: "draft",
    visibility: "hidden",
    created: "2024-01-20",
    sales: 0,
  },
]

const statusColors = {
  active: "bg-green-100 text-green-800",
  draft: "bg-yellow-100 text-yellow-800",
  archived: "bg-gray-100 text-gray-800",
}

const visibilityColors = {
  published: "bg-blue-100 text-blue-800",
  hidden: "bg-gray-100 text-gray-800",
  scheduled: "bg-purple-100 text-purple-800",
}

function CollectionsActions() {
  return (
    <div className="flex items-center gap-2 lg:gap-3">
      <Button
        variant="outline"
        size="sm"
        className="bg-white border-gray-200 text-gray-900 hover:bg-gray-50"
      >
        <Filter className="h-4 w-4 mr-2 text-purple-500" />
        Filter
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="bg-white border-gray-200 text-gray-900 hover:bg-gray-50"
      >
        <Download className="h-4 w-4 mr-2 text-green-500" />
        Export
      </Button>
      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
        <Plus className="h-4 w-4 mr-2" />
        Create Collection
      </Button>
    </div>
  )
}

export default function CollectionsPage() {
  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <MobileHeader 
        title="Collections" 
        subtitle="Organize products into themed collections" 
        actions={<CollectionsActions />} 
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
              <Input placeholder="Search collections..." className="w-full lg:w-80 pl-10" />
            </div>
          </div>

          {/* Collections Table */}
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle>All Collections</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Collection</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Visibility</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {collections.map((collection) => (
                    <TableRow key={collection.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center">
                            <Layers className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <div className="font-medium">{collection.name}</div>
                            <div className="text-sm text-gray-500">{collection.description}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                          {collection.products} products
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[collection.status as keyof typeof statusColors]}>
                          {collection.status.charAt(0).toUpperCase() + collection.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={visibilityColors[collection.visibility as keyof typeof visibilityColors]}>
                          {collection.visibility.charAt(0).toUpperCase() + collection.visibility.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{collection.sales}</TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(collection.created).toLocaleDateString()}
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
                              <DropdownMenuItem>View collection</DropdownMenuItem>
                              <DropdownMenuItem>Edit products</DropdownMenuItem>
                              <DropdownMenuItem>Analytics</DropdownMenuItem>
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
