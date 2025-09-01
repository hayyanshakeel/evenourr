"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAdminAuth } from "@/hooks/useAdminAuth"
import { useSettings } from "@/hooks/useSettings"
import { formatCurrency as formatCurrencyUtil } from "@/lib/currencies"
import { secureAdminApi } from "@/lib/secure-admin-api"
import { AdminPageLayout } from "@/components/admin/admin-page-layout"
import { AdminStatsCard } from "@/components/admin/admin-stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TableSkeleton, InlineLoading } from "@/components/ui/loading"
import { 
  Package,
  AlertTriangle,
  DollarSign,
  Eye,
  MoreHorizontal,
  Edit,
  Plus
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface InventoryStats {
  totalItems: number;
  lowStock: number;
  outOfStock: number;
  totalValue: number;
}

interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  status: string;
  lastUpdated: string;
}

interface Warehouse { id: number; code: string; name: string }

export default function InventoryPage() {
  const router = useRouter()
  const { makeAuthenticatedRequest, isReady, isAuthenticated } = useAdminAuth()
  const { currency } = useSettings()
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [stats, setStats] = useState<InventoryStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [warehouseId, setWarehouseId] = useState<number | null>(null)

  useEffect(() => {
    // Only fetch data when authenticated and ready
    if (isReady && isAuthenticated) {
      console.log('[Inventory] Fetching data with proper authentication');
      Promise.all([fetchWarehouses()]).then(() => {
        fetchInventory()
        fetchStats()
      })
    }
  }, [isReady, isAuthenticated])

  const fetchWarehouses = async () => {
    try {
      const res = await secureAdminApi.getWarehouses()
      if (res.success && res.data) {
        const list: Warehouse[] = Array.isArray(res.data) ? res.data : []
        setWarehouses(list)
        if (!warehouseId && list.length > 0) {
          const first = list[0]
          if (first && typeof first.id === 'number') {
            setWarehouseId(first.id)
          }
        }
      } else {
        console.error('Failed to fetch warehouses:', res.error)
        setWarehouses([])
      }
    } catch (e) {
      console.error('Failed to load warehouses', e)
      setWarehouses([])
    }
  }

  const fetchInventory = async () => {
    try {
      setLoading(true)
      const params: any = {}
      if (warehouseId) params.warehouseId = String(warehouseId)
      
      const response = await secureAdminApi.getInventory(params)
      if (response.success && response.data) {
        setInventory(Array.isArray(response.data) ? response.data : [])
      } else {
        console.error('Failed to fetch inventory:', response.error)
        setInventory([])
      }
    } catch (err) {
      console.error('Failed to fetch inventory:', err)
      setInventory([])
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await secureAdminApi.getInventoryStats()
      if (response.success && response.data) {
        setStats(response.data)
      } else {
        console.error('Failed to fetch inventory stats:', response.error)
        setStats(null)
      }
    } catch (err) {
      console.error('Failed to fetch inventory stats:', err)
      setStats(null)
    }
  }

  useEffect(() => {
    // Only fetch data when authenticated and ready
    if (isReady && isAuthenticated) {
      console.log('[Inventory] Fetching data for warehouse change');
      fetchInventory()
      fetchStats()
    }
  }, [isReady, isAuthenticated, warehouseId])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in stock': return 'bg-emerald-100 text-black border-emerald-200 !bg-emerald-100 !text-black'
      case 'low stock': return 'bg-amber-100 text-black border-amber-200 !bg-amber-100 !text-black'
      case 'out of stock': return 'bg-rose-100 text-black border-rose-200 !bg-rose-100 !text-black'
      default: return 'bg-slate-100 text-black border-slate-200 !bg-slate-100 !text-black'
    }
  }

  const formatPrice = (price: number) => {
    return formatCurrencyUtil(price, currency)
  }

  const handleViewDetails = (itemId: number) => {
    router.push(`/hatsadmin/dashboard/inventory/${itemId}`)
  }

  const handleAdjustStock = (itemId: number) => {
    router.push(`/hatsadmin/dashboard/inventory/${itemId}/adjust`)
  }

  const handleAddInventory = () => {
    router.push('/hatsadmin/dashboard/inventory/add')
  }

  const handleExport = async () => {
    try {
      setExporting(true)
      const response = await makeAuthenticatedRequest('/api/admin/inventory/export')
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `inventory-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Failed to export inventory:', error)
    } finally {
      setExporting(false)
    }
  }

  const statsCards = (
    <>
      <AdminStatsCard
        title="Total Items"
        value={(stats?.totalItems || 0).toString()}
        subtitle="All items"
        icon={Package}
        color="text-blue-500"
        bgColor="bg-blue-50"
        borderColor="border-blue-200"
      />
      <AdminStatsCard
        title="Low Stock Items"
        value={(stats?.lowStock || 0).toString()}
        subtitle="Need attention"
        icon={AlertTriangle}
        color="text-yellow-500"
        bgColor="bg-yellow-50"
        borderColor="border-yellow-200"
      />
      <AdminStatsCard
        title="Out of Stock"
        value={(stats?.outOfStock || 0).toString()}
        subtitle="No inventory"
        icon={AlertTriangle}
        color="text-red-500"
        bgColor="bg-red-50"
        borderColor="border-red-200"
      />
      <AdminStatsCard
        title="Total Value"
        value={formatPrice(stats?.totalValue || 0)}
        subtitle="Inventory value"
        icon={DollarSign}
        color="text-green-500"
        bgColor="bg-green-50"
        borderColor="border-green-200"
      />
    </>
  )

  return (
    <AdminPageLayout
      title="Inventory"
      subtitle={warehouses.length ? `Warehouse: ${warehouses.find(w => w.id === warehouseId)?.name || ''}` : "Manage stock levels and product availability"}
      searchPlaceholder="Search inventory..."
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      showFilters={true}
      showExport={true}
      onExport={handleExport}
      addButtonText="Adjust Stock"
      onAdd={handleAddInventory}
      statsCards={statsCards}
      loading={loading}
    >
      <Card className="admin-card border-0 shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Inventory Items</CardTitle>
            {warehouses.length > 0 && (
              <select
                className="border rounded-md px-3 py-1 text-sm"
                value={warehouseId ?? ''}
                onChange={(e) => setWarehouseId(Number(e.target.value))}
              >
                {warehouses.map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            )}
            {searching && <InlineLoading text="Searching..." size="sm" />}
            {exporting && <InlineLoading text="Exporting..." size="sm" />}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6">
              <TableSkeleton rows={8} columns={7} />
            </div>
          ) : inventory.length === 0 ? (
            <div className="text-center py-12 px-6">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No inventory items found</h3>
              <p className="text-gray-500 mb-4 max-w-sm mx-auto">
                {searchTerm 
                  ? "No items match your search criteria. Try adjusting your search terms." 
                  : "Get started by adding your first inventory item to track stock levels."
                }
              </p>
              {!searchTerm && (
                <Button onClick={handleAddInventory} className="bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 shadow-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Item
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-semibold">Product</TableHead>
                    <TableHead className="font-semibold">SKU</TableHead>
                    <TableHead className="font-semibold">Quantity</TableHead>
                    <TableHead className="font-semibold">Price</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold hidden sm:table-cell">Last Updated</TableHead>
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell>
                        <div className="font-medium text-gray-900">{item.name}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-500 font-mono">{item.sku}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{item.quantity} units</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{formatPrice(item.price)}</div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={`${getStatusColor(item.status)} border`} 
                          variant="secondary"
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="text-sm text-gray-500">
                          {new Date(item.lastUpdated).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem 
                              onClick={() => handleViewDetails(item.id)}
                              className="text-slate-700 hover:bg-slate-50 focus:bg-slate-50"
                            >
                              <Eye className="h-4 w-4 mr-2 text-slate-600" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleAdjustStock(item.id)}
                              className="text-slate-700 hover:bg-slate-50 focus:bg-slate-50"
                            >
                              <Edit className="h-4 w-4 mr-2 text-slate-600" />
                              Adjust Stock
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
    </AdminPageLayout>
  )
}
