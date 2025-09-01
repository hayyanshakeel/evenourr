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
  Layers, 
  TrendingUp, 
  Package, 
  Eye,
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
  Filter,
  Download
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAdminAuth } from "@/hooks/useAdminAuth"
import { secureAdminApi } from '@/lib/secure-admin-api';

interface Collection {
  id: number;
  title: string;
  handle: string;
  description?: string;
  createdAt: string;
  productCount: number;
}

interface CollectionStats {
  totalCollections: number;
  activeCollections: number;
  totalProducts: number;
  averageProductsPerCollection: number;
}

export default function CollectionsPage() {
  const router = useRouter()
  const { makeAuthenticatedRequest, isReady, isAuthenticated } = useAdminAuth()
  const [collections, setCollections] = useState<Collection[]>([])
  const [stats, setStats] = useState<CollectionStats | null>(null)
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
    // Only fetch data when authenticated and ready
    if (isReady && isAuthenticated) {
      console.log('[Collections] Fetching data with proper authentication');
      if (!loading) {
        setFiltering(true)
      }
      fetchData()
    }
  }, [isReady, isAuthenticated, debouncedSearchQuery])

  async function fetchData() {
    try {
      console.log('[Collections] Starting API calls...');
      if (!loading) setFiltering(true)
      if (loading) setLoading(true)
      
      const params = new URLSearchParams()
      if (debouncedSearchQuery.trim()) {
        params.append('search', debouncedSearchQuery.trim())
      }
      
      const [collectionsResponse, statsResponse] = await Promise.all([
        makeAuthenticatedRequest(`/api/admin/collections?${params}`),
        makeAuthenticatedRequest('/api/admin/collections/stats')
      ])

      console.log('[Collections] API responses:', { 
        collectionsOk: collectionsResponse.ok, 
        statsOk: statsResponse.ok 
      });

      if (collectionsResponse.ok) {
        const collectionsData = await collectionsResponse.json()
        const collectionsArray = collectionsData?.collections || collectionsData || []
        setCollections(Array.isArray(collectionsArray) ? collectionsArray : [])
      } else {
        console.error('Failed to fetch collections:', collectionsResponse.status, await collectionsResponse.text())
        setCollections([])
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      } else {
        console.error('Failed to fetch stats:', statsResponse.status, await statsResponse.text())
        setStats(null)
      }
    } catch (error) {
      console.error('Failed to fetch collections:', error)
      setCollections([])
      setStats(null)
    } finally {
      setLoading(false)
      setFiltering(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this collection?')) return;
    
    try {
      console.log(`Attempting to delete collection ID: ${id}`);
      const response = await secureAdminApi.deleteCollection(id.toString());
      
      console.log('Delete response:', response);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete collection');
      }

      console.log('Collection deleted successfully, refreshing list...');
      await fetchData();
    } catch (error) {
      console.error('Error deleting collection:', error);
      alert(`Error deleting collection: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/hatsadmin/dashboard/collections/${id}/edit`);
  };

  const handleCreate = () => {
    router.push('/hatsadmin/dashboard/collections/new');
  };

  const handleExport = async () => {
    try {
      const response = await makeAuthenticatedRequest('/api/admin/collections/export');
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'collections.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Failed to export collections:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-emerald-100 text-black !bg-emerald-100 !text-black';
      case 'draft': return 'bg-amber-100 text-black !bg-amber-100 !text-black';
      case 'archived': return 'bg-slate-100 text-black !bg-slate-100 !text-black';
      default: return 'bg-slate-100 text-black !bg-slate-100 !text-black';
    }
  };

  const getVisibilityColor = (visibility: string) => {
    switch (visibility.toLowerCase()) {
      case 'published': return 'bg-sky-100 text-black !bg-sky-100 !text-black';
      case 'hidden': return 'bg-slate-100 text-black !bg-slate-100 !text-black';
      case 'scheduled': return 'bg-violet-100 text-black !bg-violet-100 !text-black';
      default: return 'bg-slate-100 text-black !bg-slate-100 !text-black';
    }
  };

  return (
    <AdminPageLayout
      title="Collections" 
      subtitle="Organize products into themed collections"
      searchPlaceholder="Search collections..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      showFilters={true}
      showExport={true}
      exportText="Export"
      onExport={handleExport}
      addButtonText="Create Collection"
      onAdd={handleCreate}
      loading={loading}
      statsCards={
        <>
          <AdminStatsCard
            title="Total Collections"
            value={stats?.totalCollections?.toString() || "0"}
            subtitle="Total collections"
            icon={Layers}
            color="text-blue-500"
            bgColor="bg-blue-50"
            borderColor="border-blue-200"
          />
          <AdminStatsCard
            title="Active Collections"
            value={stats?.activeCollections?.toString() || "0"}
            subtitle="Active collections"
            icon={TrendingUp}
            color="text-green-500"
            bgColor="bg-green-50"
            borderColor="border-green-200"
          />
          <AdminStatsCard
            title="Total Products"
            value={stats?.totalProducts?.toString() || "0"}
            subtitle="In collections"
            icon={Package}
            color="text-purple-500"
            bgColor="bg-purple-50"
            borderColor="border-purple-200"
          />
          <AdminStatsCard
            title="Avg Products"
            value={stats?.averageProductsPerCollection?.toString() || "0"}
            subtitle="Per collection"
            icon={Eye}
            color="text-orange-500"
            bgColor="bg-orange-50"
            borderColor="border-orange-200"
          />
        </>
      }
    >
      {/* Collections Table */}
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle>All Collections</CardTitle>
        </CardHeader>
        <CardContent>
          {filtering && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-pulse">Filtering collections...</div>
            </div>
          )}
          {!filtering && collections.length === 0 ? (
            <div className="text-center py-8">
              <Layers className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No collections</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new collection.</p>
              <div className="mt-6">
                <Button onClick={handleCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Collection
                </Button>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Collection</TableHead>
                  <TableHead>Products</TableHead>
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
                          <div className="font-medium">{collection.title}</div>
                          {collection.description && (
                            <div className="text-sm text-gray-500">{collection.description}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                        {collection.productCount || 0} products
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(collection.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEdit(collection.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(collection.id)}>
                              Edit collection
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDelete(collection.id)}
                            >
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
          )}
        </CardContent>
      </Card>
    </AdminPageLayout>
  )
}
