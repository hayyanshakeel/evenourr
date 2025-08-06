'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, Filter, Edit, Trash2, MoreHorizontal, Package, DollarSign, TrendingUp, AlertTriangle, Eye, Download } from 'lucide-react';

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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const handleExport = () => {
    // Export products to CSV
    const headers = ['Name', 'Price', 'Inventory', 'Status', 'Created']
    const csvData = products.map(product => [
      product.name,
      product.price,
      product.inventory,
      product.status,
      new Date(product.createdAt).toLocaleDateString()
    ])
    
    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'products.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/admin/products/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchProducts();
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockStatus = (inventory: number) => {
    if (inventory === 0) return { status: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (inventory <= 10) return { status: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    return { status: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'active').length;
  const lowStockProducts = products.filter(p => p.inventory <= 10).length;
  const draftProducts = products.filter(p => p.status === 'draft').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 lg:px-6 xl:px-8 py-6 lg:py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
            
            {/* Title Section */}
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                Products
              </h1>
              <p className="mt-2 text-sm lg:text-base text-gray-600 leading-relaxed">
                Manage your product catalog and inventory
              </p>
            </div>

            {/* Actions Section */}
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search products..." 
                  className="w-full lg:w-80 pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-2 px-2 sm:mx-0 sm:px-0 sm:gap-3">
                <Button variant="outline" size="sm" className="px-2 sm:px-3" onClick={() => setShowFilters(!showFilters)}>
                  <Filter className="h-4 w-4" />
                  <span className="ml-1 sm:ml-2 text-xs sm:text-sm">Filter</span>
                </Button>
                <Button variant="outline" size="sm" className="px-2 sm:px-3" onClick={handleExport}>
                  <Download className="h-4 w-4" />
                  <span className="ml-1 sm:ml-2 text-xs sm:text-sm">Export</span>
                </Button>
                <Button variant="black" size="sm" onClick={handleAddProduct} className="px-2 sm:px-3">
                  <Plus className="h-4 w-4" />
                  <span className="ml-1 sm:ml-2 text-xs sm:text-sm">Add Product</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <main className="flex-1 overflow-auto">
        <div className="space-y-6 lg:space-y-8">

          {/* Stats Cards */}
          <div className="grid gap-4 md:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-8">
            <Card
              className="admin-card relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-blue-200"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Products
                </CardTitle>
                <div className="p-2 rounded-lg bg-blue-50">
                  <Package className="h-4 w-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {totalProducts}
                </div>
              </CardContent>
            </Card>
            
            <Card
              className="admin-card relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-green-200"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Active Products
                </CardTitle>
                <div className="p-2 rounded-lg bg-green-50">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {activeProducts}
                </div>
              </CardContent>
            </Card>

            <Card
              className="admin-card relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-yellow-200"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Low Stock
                </CardTitle>
                <div className="p-2 rounded-lg bg-yellow-50">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                  {lowStockProducts}
                </div>
              </CardContent>
            </Card>

            <Card
              className="admin-card relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-purple-200"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Draft Products
                </CardTitle>
                <div className="p-2 rounded-lg bg-purple-50">
                  <DollarSign className="h-4 w-4 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {draftProducts}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Table */}
          <Card className="admin-card">
            <CardHeader>
              <CardTitle>All Products</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-500 mb-4">
                    {products.length === 0 
                      ? "Get started by adding your first product." 
                      : "No products match your search criteria."
                    }
                  </p>
                  {products.length === 0 && (
                    <Button onClick={handleAddProduct}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Product
                    </Button>
                  )}
                </div>
              ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Inventory</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product.inventory);
                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Package className="h-5 w-5 text-gray-400" />
                            </div>
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-gray-500">ID: {product.id}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(product.status)}>
                            {product.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatPrice(product.price)}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{product.inventory} units</div>
                            <Badge className={stockStatus.color} variant="secondary">
                              {stockStatus.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(product.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewProduct(product.id)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditProduct(product.id)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        </div>
      </main>
    </div>
  );
}
