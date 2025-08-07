'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Package, DollarSign, Calendar, BarChart3 } from 'lucide-react';

interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  status: string;
  lastUpdated: string;
  description?: string;
  category?: { id: number; name: string };
  imageUrl?: string;
}

export default function InventoryDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { makeAuthenticatedRequest } = useAdminAuth();
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchInventoryItem();
    }
  }, [params.id]);

  const fetchInventoryItem = async () => {
    try {
      setLoading(true);
      // For now, we'll get the product details since inventory is likely based on products
      const response = await makeAuthenticatedRequest(`/api/admin/products/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setItem({
          id: data.id,
          name: data.name,
          sku: data.sku || data.slug,
          quantity: data.inventory || 0,
          price: data.price,
          status: data.inventory > 10 ? 'In Stock' : data.inventory > 0 ? 'Low Stock' : 'Out of Stock',
          lastUpdated: data.updatedAt,
          description: data.description,
          category: data.category,
          imageUrl: data.imageUrl,
        });
      }
    } catch (error) {
      console.error('Error fetching inventory item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/hatsadmin/dashboard/inventory');
  };

  const handleEdit = () => {
    router.push(`/hatsadmin/dashboard/inventory/${params.id}/adjust`);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in stock': return 'bg-emerald-100 text-black border-emerald-200 !bg-emerald-100 !text-black';
      case 'low stock': return 'bg-amber-100 text-black border-amber-200 !bg-amber-100 !text-black';
      case 'out of stock': return 'bg-rose-100 text-black border-rose-200 !bg-rose-100 !text-black';
      default: return 'bg-slate-100 text-black border-slate-200 !bg-slate-100 !text-black';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading inventory details...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Item Not Found</h1>
          <p className="text-gray-600 mb-4">The inventory item you're looking for doesn't exist.</p>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Inventory
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button onClick={handleBack} variant="outline" size="sm" className="border-slate-300 hover:border-slate-400 hover:bg-slate-50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{item.name}</h1>
                <p className="text-gray-600">SKU: {item.sku}</p>
              </div>
            </div>
            <Button onClick={handleEdit} className="bg-slate-900 hover:bg-slate-800 text-white border border-slate-700">
              <Edit className="h-4 w-4 mr-2" />
              Adjust Stock
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Image */}
            {item.imageUrl && (
              <Card>
                <CardHeader>
                  <CardTitle>Product Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <img 
                    src={item.imageUrl} 
                    alt={item.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </CardContent>
              </Card>
            )}

            {/* Description */}
            {item.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{item.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Inventory History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Inventory History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Inventory tracking history will be available soon.</p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Current Stock</span>
                  <span className="font-semibold text-lg">{item.quantity} units</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Unit Price</span>
                  <span className="font-semibold">{formatPrice(item.price)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Value</span>
                  <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status</span>
                  <Badge className={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Product Details */}
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Product ID</span>
                  <span className="font-mono text-sm">{item.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">SKU</span>
                  <span className="font-mono text-sm">{item.sku}</span>
                </div>
                {item.category && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Category</span>
                    <span className="text-sm">{item.category.name}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="text-sm">{new Date(item.lastUpdated).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={handleEdit} className="w-full bg-slate-900 hover:bg-slate-800 text-white border border-slate-700">
                  <Edit className="h-4 w-4 mr-2" />
                  Adjust Stock Level
                </Button>
                <Button 
                  onClick={() => router.push(`/hatsadmin/dashboard/products/${item.id}/edit`)} 
                  variant="outline" 
                  className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Edit Product Details
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
