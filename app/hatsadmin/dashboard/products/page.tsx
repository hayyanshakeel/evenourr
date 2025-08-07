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

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    if (isReady && isAuthenticated) {
      fetchProducts();
    }
  }, [isReady, isAuthenticated, debouncedSearchTerm, statusFilter]);

  const fetchProducts = async () => {
    if (!isReady || !isAuthenticated) return;
    
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (debouncedSearchTerm.trim()) {
        params.append('search', debouncedSearchTerm.trim());
      }
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      
      const response = await makeAuthenticatedRequest(`/api/admin/products?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await makeAuthenticatedRequest('/api/admin/products/export');
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'products.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
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
      const response = await makeAuthenticatedRequest(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        await fetchProducts();
      } else {
        console.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

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
        <CardHeader>
          <CardTitle>All Products</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No products</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new product.</p>
              <div className="mt-6">
                <Button onClick={handleAddProduct}>
                  <Package className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => {
                  const stockStatus = getStockStatus(product.inventory);
                  return (
                    <TableRow key={product.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center">
                            <Package className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-gray-500">ID: {product.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatPrice(product.price)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col space-y-1">
                          <span className="font-medium">{product.inventory}</span>
                          <Badge className={`${stockStatus.color} text-xs`}>
                            {stockStatus.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(product.status)}>
                          {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditProduct(product.id)}
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
                              <DropdownMenuItem onClick={() => handleViewProduct(product.id)}>
                                View product
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditProduct(product.id)}>
                                Edit product
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/hatsadmin/dashboard/products/${product.id}/duplicate`)}>
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
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
          )}
        </CardContent>
      </Card>
    </AdminPageLayout>
  );
}
