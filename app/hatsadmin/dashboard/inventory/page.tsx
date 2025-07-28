'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MagnifyingGlassIcon, 
  AdjustmentsHorizontalIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface InventoryItem {
  id: number;
  product: {
    id: number;
    title: string;
    image?: string;
    handle: string;
  };
  variant: {
    id: number;
    title: string;
    sku?: string;
    price: number;
  };
  quantity: number;
  available: number;
  committed: number;
  onHand: number;
  location: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

export default function InventoryPage() {
  const router = useRouter();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      
      // Fetch real products from the API
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const products = await response.json();
      
      // Transform products into inventory items
      const inventoryItems: InventoryItem[] = products.map((product: any, index: number) => {
        const quantity = product.quantity || 0;
        const committed = Math.floor(quantity * 0.1); // Simulate 10% committed
        const available = quantity - committed;
        
        return {
          id: product.id,
          product: {
            id: product.id,
            title: product.name || product.title,
            handle: product.handle || product.name?.toLowerCase().replace(/\s+/g, '-') || 'product',
            image: product.imageUrl || product.images?.[0]
          },
          variant: {
            id: product.id * 10, // Generate variant ID
            title: 'Default variant',
            sku: product.sku || `SKU-${product.id}`,
            price: product.price || 0
          },
          quantity: quantity,
          available: available,
          committed: committed,
          onHand: quantity,
          location: 'Main Warehouse',
          status: quantity === 0 ? 'out-of-stock' : quantity <= 10 ? 'low-stock' : 'in-stock'
        };
      });
      
      setInventory(inventoryItems);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      
      // Fallback to empty inventory if API fails
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.variant.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in-stock':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'low-stock':
        return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />;
      case 'out-of-stock':
        return <ClockIcon className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'in-stock':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'low-stock':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'out-of-stock':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const updateQuantity = async (inventoryId: number, newQuantity: number) => {
    try {
      // Find the inventory item to get the product ID
      const inventoryItem = inventory.find(item => item.id === inventoryId);
      if (!inventoryItem) {
        console.error('Inventory item not found:', inventoryId);
        return;
      }

      console.log('Updating product quantity:', {
        productId: inventoryItem.product.id,
        newQuantity
      });

      // Update the product quantity via API
      const response = await fetch(`/api/products/${inventoryItem.product.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity: newQuantity
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`Failed to update quantity: ${response.status} ${errorText}`);
      }

      const updatedProduct = await response.json();
      console.log('Product updated successfully:', updatedProduct);

      // Update local state
      setInventory(prev => prev.map(item => 
        item.id === inventoryId 
          ? { 
              ...item, 
              quantity: newQuantity,
              available: newQuantity - item.committed,
              onHand: newQuantity,
              status: newQuantity === 0 ? 'out-of-stock' : newQuantity <= 10 ? 'low-stock' : 'in-stock'
            }
          : item
      ));
    } catch (error) {
      console.error('Error updating quantity:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to update quantity: ${errorMessage}`);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your product inventory levels</p>
        </div>
      </div>

      {/* Inventory Management Card */}
      <div className="mt-8 rounded-lg border bg-white shadow-sm">
        {/* Search and Filter Section */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-sm transition-colors"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-sm transition-colors sm:max-w-xs"
            >
              <option value="all">All Status</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="overflow-hidden">
          {loading ? (
            <div className="p-6 sm:p-12 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-600 mx-auto"></div>
              <p className="mt-3 text-sm text-gray-500">Loading inventory...</p>
            </div>
          ) : filteredInventory.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <AdjustmentsHorizontalIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No inventory found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="hidden sm:table-cell px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="hidden lg:table-cell px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Available
                  </th>
                  <th className="hidden lg:table-cell px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Committed
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    On hand
                  </th>
                  <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInventory.map((item) => (
                  <tr 
                    key={item.id} 
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => router.push(`/hatsadmin/dashboard/products/${item.product.id}/edit`)}
                  >
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                            {item.product.image ? (
                              <img
                                src={item.product.image}
                                alt={item.product.title}
                                className="h-12 w-12 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-lg bg-gray-200"></div>
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">
                            {item.product.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.variant.title}
                          </div>
                          <div className="sm:hidden text-xs text-gray-400 mt-1">
                            SKU: {item.variant.sku || '-'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.variant.sku || '-'}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(item.status)}
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.status === 'in-stock' ? 'bg-green-100 text-green-800' :
                          item.status === 'low-stock' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item.status === 'in-stock' ? 'In stock' : 
                           item.status === 'low-stock' ? 'Low stock' : 'Out of stock'}
                        </span>
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {item.available}
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {item.committed}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right">
                      <input
                        type="number"
                        value={item.onHand}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                        onClick={(e) => e.stopPropagation()} // Prevent row click when editing quantity
                        className="w-16 sm:w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                        min="0"
                      />
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.location}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}