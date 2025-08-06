"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { AdminCollection } from "@/lib/admin-data"

interface CollectionStats {
  totalCollections: number;
  activeCollections: number;
  totalProducts: number;
  averageProductsPerCollection: number;
}

export default function CollectionsPage() {
  const router = useRouter()
  const [collections, setCollections] = useState<AdminCollection[]>([])
  const [stats, setStats] = useState<CollectionStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    async function fetchData() {
      try {
        const [collectionsResponse, statsResponse] = await Promise.all([
          fetch('/api/admin/collections'),
          fetch('/api/admin/collections/stats')
        ])

        if (collectionsResponse.ok) {
          const collectionsData = await collectionsResponse.json()
          setCollections(collectionsData)
        }

        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setStats(statsData)
        }
      } catch (error) {
        console.error('Failed to fetch collections data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleAddCollection = () => {
    router.push("/hatsadmin/dashboard/collections/add")
  }

  const filteredCollections = collections.filter(collection =>
    collection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collection.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const collectionsStats = stats ? [
    {
      title: "Total Collections",
      value: stats.totalCollections.toString(),
      change: "Collections created",
      icon: Layers,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Active Collections",
      value: stats.activeCollections.toString(),
      change: `${stats.totalCollections > 0 ? Math.round((stats.activeCollections / stats.totalCollections) * 100) : 0}% active`,
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      title: "Total Products",
      value: stats.totalProducts.toString(),
      change: "In collections",
      icon: Package,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      title: "Avg Products",
      value: stats.averageProductsPerCollection.toString(),
      change: "Per collection",
      icon: Calendar,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
  ] : []

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="default" className="bg-green-100 text-green-700">Active</Badge>
    ) : (
      <Badge variant="secondary">Inactive</Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <PageHeader
          title="Collections"
          subtitle="Organize your products into collections"
        />
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16 animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <PageHeader
        title="Collections"
        subtitle="Organize your products into collections"
      />
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {collectionsStats.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <Card key={index} className={`border ${stat.borderColor} hover:shadow-md transition-shadow`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`h-4 w-4 ${stat.color}`}>
                  <IconComponent className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Collections Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Collections</CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                {filteredCollections.length} total collections
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button onClick={handleAddCollection} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Collection
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {filteredCollections.length === 0 ? (
            <div className="text-center py-12">
              <Layers className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No collections available
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery 
                  ? "No collections match your search criteria." 
                  : "Get started by creating your first collection to organize your products."
                }
              </p>
              {!searchQuery && (
                <Button onClick={handleAddCollection}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Collection
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Collection</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCollections.map((collection) => (
                    <TableRow key={collection.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md border bg-gray-100 flex items-center justify-center">
                            <Layers className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <div className="font-medium">{collection.title}</div>
                            <div className="text-sm text-gray-500">
                              {collection.description || 'No description'}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{collection.productCount || 0}</span>
                        <span className="text-gray-500 ml-1">products</span>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(collection.status === 'ACTIVE')}
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {collection.createdAt ? new Date(collection.createdAt).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {collection.updatedAt ? new Date(collection.updatedAt).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
