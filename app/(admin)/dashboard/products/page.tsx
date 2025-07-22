// app/(admin)/dashboard/products/page.tsx
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/admin/header';
import DataTable from '@/components/admin/data-table';
import { PlusIcon } from '@heroicons/react/24/outline';

interface Product {
  id: number;
  name: string;
  price: number;
  status: 'active' | 'draft' | 'archived';
  // You can add more fields here like inventory if you query for it
}

const ProductsPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  
  const getStatusBadge = (status: Product['status']) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800',
    };
    return <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${styles[status]}`}>{status}</span>;
  };

  const columns = useMemo(() => [
    { key: 'name', label: 'Product Name' },
    { 
      key: 'price', 
      label: 'Price',
      render: (product: Product) => (
        // Format price from cents to dollars
        new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(product.price / 100)
      )
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (product: Product) => getStatusBadge(product.status)
    },
    // You can add an 'Actions' column here later
  ], []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <Header title="Products" />
        <button
          onClick={() => router.push('/dashboard/products/new')}
          className="inline-flex items-center gap-x-2 rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
        >
          <PlusIcon className="-ml-0.5 h-5 w-5" />
          Add Product
        </button>
      </div>

      <div className="mt-8">
        <DataTable
          columns={columns}
          data={products}
          loading={loading}
          emptyMessage="No products found. Add your first product to get started."
          onRowClick={(product) => router.push(`/dashboard/products/edit/${product.id}`)} // For future edit page
        />
      </div>
    </div>
  );
};

export default ProductsPage;