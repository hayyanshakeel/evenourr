'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/admin/header';
import DataTable from '@/components/admin/data-table';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Product {
  id: number;
  handle: string;
  title: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  inventory: number;
  status: string;
  createdAt: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchProducts();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Failed to delete product');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount / 100);
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      draft: 'bg-gray-100 text-gray-800',
      archived: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${colors[status] || colors.draft}`}>
        {status}
      </span>
    );
  };

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.handle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      key: 'image',
      label: 'Image',
      render: (product: Product) => (
        <div className="h-10 w-10 flex-shrink-0">
          {product.imageUrl ? (
            <img
              className="h-10 w-10 rounded-lg object-cover"
              src={product.imageUrl}
              alt={product.title}
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200">
              <span className="text-xs text-gray-500">No image</span>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'title',
      label: 'Product',
      render: (product: Product) => (
        <div>
          <div className="font-medium text-gray-900">{product.title}</div>
          <div className="text-sm text-gray-500">{product.handle}</div>
        </div>
      )
    },
    {
      key: 'price',
      label: 'Price',
      render: (product: Product) => formatCurrency(product.price)
    },
    {
      key: 'inventory',
      label: 'Inventory',
      render: (product: Product) => (
        <span className={product.inventory <= 5 ? 'text-red-600 font-medium' : ''}>
          {product.inventory}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (product: Product) => getStatusBadge(product.status)
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (product: Product) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/dashboard/products/${product.id}/edit`);
            }}
            className="rounded p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteProduct(product.id);
            }}
            className="rounded p-1 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <Header title="Products" />
        <button
          onClick={() => router.push('/dashboard/products/new')}
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" />
          Add Product
        </button>
      </div>

      <div className="mt-6">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:max-w-xs"
        />
      </div>

      <div className="mt-6">
        <DataTable
          columns={columns}
          data={filteredProducts}
          loading={loading}
          emptyMessage="No products found"
          onRowClick={(product) => router.push(`/dashboard/products/${product.id}/edit`)}
        />
      </div>
    </div>
  );
}
