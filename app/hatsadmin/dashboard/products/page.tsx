'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminPageLayout } from "@/components/admin/admin-page-layout"
import { AdminStatsCard } from "@/components/admin/admin-stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Package, TrendingUp, AlertTriangle, Eye, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { useAdminAuth } from "@/hooks/useAdminAuth"
import { useSettings } from "@/hooks/useSettings"
import { formatCurrency } from "@/lib/currencies"
import { secureAdminApi } from '@/lib/secure-admin-api';

interface Product {
  id: number;
  name: string;
  price: number;
  inventory: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const { makeAuthenticatedRequest, isReady, isAuthenticated } = useAdminAuth()
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const { currency } = useSettings()

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    // Only fetch data when authenticated and ready
    if (isReady && isAuthenticated) {
      console.log('[Products] Fetching data with proper authentication');
      fetchProducts();
    }
  }, [isReady, isAuthenticated, debouncedSearchTerm, statusFilter]);

  const fetchProducts = async () => {
    try {
      console.log('[Products] Starting API call...');
      setLoading(true);
      
      const params: any = {};
      if (debouncedSearchTerm.trim()) {
        params.search = debouncedSearchTerm.trim();
      }
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      
      console.log('[Products] Calling secureAdminApi.getProducts with params:', params);
      const response = await secureAdminApi.getProducts(params);
      console.log('[Products] API response received:', response);
      
      if (response.success) {
        const data = response.data || response;
        setProducts(data.data || data.products || data || []);
      } else {
        console.error('Failed to fetch products:', response.error);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      // For now, create CSV from current products data
      if (products.length === 0) {
        console.warn('No products to export');
        return;
      }

      const headers = ['ID', 'Name', 'Price', 'Inventory', 'Status', 'Created', 'Updated'];
      const csvData = products.map(product => [
        product.id,
        product.name,
        product.price,
        product.inventory,
        product.status,
        new Date(product.createdAt).toLocaleDateString(),
        new Date(product.updatedAt).toLocaleDateString()
      ]);
      
      const csvContent = [headers, ...csvData]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'products.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export products:', error);
    }
  };

  const handleAddProduct = () => {
    router.push('/hatsadmin/dashboard/products/new');
  };

  const handleEditProduct = (id: number) => {
    router.push(`/hatsadmin/dashboard/products/${id}/edit`);
  };

  const handleViewProduct = (id: number) => {
    router.push(`/hatsadmin/dashboard/products/${id}`);
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      console.log(`Attempting to delete product ID: ${id}`);
      const response = await secureAdminApi.deleteProduct(id.toString());
      
      console.log('Delete response:', response);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete product');
      }

      console.log('Product deleted successfully, refreshing list...');
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert(`Error deleting product: ${error instanceof Error ? error.message : String(error)}`);
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

  const getStockStatus = (inventory: number) => {
    if (inventory === 0) return { status: 'Out of Stock', color: 'bg-rose-100 text-black !bg-rose-100 !text-black' };
    if (inventory <= 10) return { status: 'Low Stock', color: 'bg-amber-100 text-black !bg-amber-100 !text-black' };
    return { status: 'In Stock', color: 'bg-emerald-100 text-black !bg-emerald-100 !text-black' };
  };

  const formatPrice = (price: number) => formatCurrency(price, currency)

  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'active').length;
  const lowStockProducts = products.filter(p => p.inventory <= 10).length;
  const draftProducts = products.filter(p => p.status === 'draft').length;

  if (!isReady || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse">Loading products...</div>
      </div>
    );
  }

  return (
    <AdminPageLayout
      title="Products"
      subtitle="Manage your product catalog and inventory"
      searchPlaceholder="Search products..."
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      showFilters={true}
      showExport={true}
      exportText="Export"
      onExport={handleExport}
      addButtonText="Add Product"
      onAdd={handleAddProduct}
      statsCards={
        <>
          <AdminStatsCard
            title="Total Products"
            value={totalProducts.toString()}
            subtitle="All products"
            icon={Package}
            color="text-blue-500"
            bgColor="bg-blue-50"
            borderColor="border-blue-200"
          />
          <AdminStatsCard
            title="Active Products"
            value={activeProducts.toString()}
            subtitle="Live products"
            icon={TrendingUp}
            color="text-green-500"
            bgColor="bg-green-50"
            borderColor="border-green-200"
          />
          <AdminStatsCard
            title="Low Stock"
            value={lowStockProducts.toString()}
            subtitle="Need attention"
            icon={AlertTriangle}
            color="text-yellow-500"
            bgColor="bg-yellow-50"
            borderColor="border-yellow-200"
          />
          <AdminStatsCard
            title="Draft Products"
            value={draftProducts.toString()}
            subtitle="Unpublished"
            icon={Eye}
            color="text-purple-500"
            bgColor="bg-purple-50"
            borderColor="border-purple-200"
          />
        </>
      }
    >
      {/* Products Table */}
      <Card className="border shadow-sm">
        <CardHeader className="p-3 sm:p-4 lg:p-6">
          <CardTitle className="text-base sm:text-lg">All Products</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-4 lg:p-6">
          {products.length === 0 ? (
            <div className="text-center py-6 sm:py-8 px-4">
              <Package className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
              <h3 className="mt-2 text-sm sm:text-base font-semibold text-gray-900">No products</h3>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">Get started by creating a new product.</p>
              <div className="mt-4 sm:mt-6">
                <Button onClick={handleAddProduct} size="sm" className="text-xs sm:text-sm">
                  <Package className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Add Product
                </Button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Mobile Card View - visible on small screens */}
              <div className="block sm:hidden space-y-3 p-3">
                {products.map((product) => {
                  const stockStatus = getStockStatus(product.inventory);
                  return (
                    <Card key={product.id} className="p-3 shadow-sm">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm text-gray-900 truncate">{product.name}</h3>
                          <p className="text-xs text-gray-500 mt-1">{formatPrice(product.price)}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewProduct(product.id)}>
                              <Eye className="mr-2 h-3 w-3" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditProduct(product.id)}>
                              <Edit className="mr-2 h-3 w-3" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-3 w-3" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(product.status)}>
                            {product.status}
                          </Badge>
                          <Badge className={stockStatus.color}>
                            {stockStatus.status} ({product.inventory})
                          </Badge>
                        </div>
                        <span className="text-gray-500">
                          {new Date(product.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Table View - visible on larger screens */}
              <Table className="hidden sm:table">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">Product</TableHead>
                    <TableHead className="text-xs sm:text-sm">Price</TableHead>
                    <TableHead className="text-xs sm:text-sm">Stock</TableHead>
                    <TableHead className="text-xs sm:text-sm">Status</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Created</TableHead>
                    <TableHead className="text-right text-xs sm:text-sm">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => {
                    const stockStatus = getStockStatus(product.inventory);
                    return (
                      <TableRow key={product.id} className="hover:bg-gray-50">
                        <TableCell className="py-2 sm:py-4">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-md bg-gray-100 flex items-center justify-center">
                            <Package className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                          </div>
                          <div>
                            <div className="font-medium text-xs sm:text-sm">{product.name}</div>
                            <div className="text-xs text-gray-500">ID: {product.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-xs sm:text-sm py-2 sm:py-4">
                        {formatPrice(product.price)}
                      </TableCell>
                      <TableCell className="py-2 sm:py-4">
                        <div className="flex flex-col space-y-1">
                          <span className="font-medium text-xs sm:text-sm">{product.inventory}</span>
                          <Badge className={`${stockStatus.color} text-xs`}>
                            {stockStatus.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="py-2 sm:py-4">
                        <Badge className={`${getStatusColor(product.status)} text-xs`}>
                          {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-gray-500 py-2 sm:py-4 hidden lg:table-cell">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right py-2 sm:py-4">
                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditProduct(product.id)}
                            className="h-6 w-6 sm:h-8 sm:w-8 p-0 sm:p-2"
                          >
                            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 sm:h-8 sm:w-8 p-0 sm:p-2">
                                <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewProduct(product.id)}>
                                <Eye className="h-3 w-3 mr-2" />
                                View product
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditProduct(product.id)}>
                                <Edit className="h-3 w-3 mr-2" />
                                Edit product
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/hatsadmin/dashboard/products/${product.id}/duplicate`)}>
                                <Package className="h-3 w-3 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="h-3 w-3 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminPageLayout>
  );
}
