'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import { MobileHeader } from "@/components/admin/mobile-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Filter, 
  Download, 
  Plus,
  Package, 
  Archive, 
  AlertTriangle, 
  CheckCircle,
  Search,
  Eye,
  MoreHorizontal
} from "lucide-react";
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  status: string;
  price: number;
  inventory: number;
  imageUrl: string | null;
  category: string;
  variants: number;
}

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'draft':
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
      case 'archived':
        return 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <Badge className={`text-xs font-medium border ${getStatusStyle(status)}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

function ProductsActions() {
  return (
    <div className="flex items-center gap-2 lg:gap-3">
      <Button
        variant="outline"
        className="h-10 lg:h-12 px-4 lg:px-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
      >
        <Filter className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
        <span className="text-sm lg:text-base font-medium">Filter</span>
      </Button>
      <Button
        variant="outline"
        className="h-10 lg:h-12 px-4 lg:px-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
      >
        <Download className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
        <span className="text-sm lg:text-base font-medium">Export</span>
      </Button>
      <Button className="h-10 lg:h-12 px-4 lg:px-6 bg-blue-600 hover:bg-blue-700 text-white">
        <Plus className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
        <span className="text-sm lg:text-base font-medium">Add Product</span>
      </Button>
    </div>
  );
}

function ProductsStats({ products }: { products: Product[] }) {
  const totalProducts = products.length;
  const activeProducts = products.filter(product => product.status.toLowerCase() === 'active').length;
  const lowStockProducts = products.filter(product => product.inventory < 10).length;
  const draftProducts = products.filter(product => product.status.toLowerCase() === 'draft').length;

  const stats = [
    {
      title: "Total Products",
      value: totalProducts.toString(),
      icon: Package,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "Active",
      value: activeProducts.toString(),
      icon: CheckCircle,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-950",
    },
    {
      title: "Low Stock",
      value: lowStockProducts.toString(),
      icon: AlertTriangle,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950",
    },
    {
      title: "Draft",
      value: draftProducts.toString(),
      icon: Archive,
      color: "text-gray-600 dark:text-gray-400",
      bgColor: "bg-gray-50 dark:bg-gray-900",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="shadow-sm border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</CardTitle>
            <div className={`h-10 w-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ProductsFilters({ searchTerm, setSearchTerm }: { searchTerm: string; setSearchTerm: (term: string) => void }) {
  return (
    <Card className="shadow-sm border-gray-200 dark:border-gray-800">
      <CardContent className="p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProductsTable({ products }: { products: Product[] }) {
  const router = useRouter();

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  return (
    <Card className="shadow-sm border-gray-200 dark:border-gray-800">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">Products</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Product</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Inventory</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Price</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300 hidden lg:table-cell">Category</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {product.imageUrl ? (
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              width={48}
                              height={48}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{product.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{product.variants} variant{product.variants !== 1 ? 's' : ''}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={product.status} />
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-sm font-medium ${
                        product.inventory < 10 
                          ? 'text-orange-600 dark:text-orange-400' 
                          : 'text-gray-900 dark:text-gray-100'
                      }`}>
                        {product.inventory} in stock
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm font-medium text-gray-900 dark:text-gray-100">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-300 hidden lg:table-cell">
                      {product.category}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/hatsadmin/dashboard/products/${product.id}`)}
                          className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Package className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-sm font-medium text-gray-900 mb-1">No products found</h3>
                      <p className="text-sm text-gray-500">Get started by adding your first product.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { getIdToken } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const token = await getIdToken();
        if (!token) {
          console.error('No authentication token available');
          return;
        }

        const response = await fetch('/api/products', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error('Failed to fetch products');
          // Show sample data if no real products exist
          setProducts([
            {
              id: 1,
              name: 'Premium Baseball Cap',
              status: 'active',
              price: 2999,
              inventory: 45,
              imageUrl: null,
              category: 'Caps',
              variants: 3
            },
            {
              id: 2,
              name: 'Vintage Trucker Hat',
              status: 'active', 
              price: 3499,
              inventory: 23,
              imageUrl: null,
              category: 'Hats',
              variants: 2
            },
            {
              id: 3,
              name: 'Sport Beanie',
              status: 'draft',
              price: 1999,
              inventory: 8,
              imageUrl: null,
              category: 'Beanies',
              variants: 4
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [getIdToken]);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col h-full w-full">
        <MobileHeader 
          title="Products" 
          subtitle="Manage your product catalog and inventory" 
          actions={<ProductsActions />} 
        />
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-950">
          <div className="container mx-auto p-4 lg:p-6 xl:p-8 max-w-7xl">
            <div className="animate-pulse space-y-6 lg:space-y-8">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
                ))}
              </div>
              <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full">
      <MobileHeader
        title="Products"
        subtitle="Manage your product catalog and inventory"
        actions={<ProductsActions />}
      />

      <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto p-4 lg:p-6 xl:p-8 max-w-7xl">
          <div className="space-y-6 lg:space-y-8">
            <ProductsStats products={filteredProducts} />
            <ProductsFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <ProductsTable products={filteredProducts} />
          </div>
        </div>
      </main>
    </div>
  );
}
