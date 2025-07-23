'use client';

import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/admin/header';
import DataTable from '@/components/admin/data-table';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import clsx from 'clsx';

interface Product {
  id: number;
  name: string;
  status: string;
  price: number;
  inventory: number;
  imageUrl: string | null;
  category: string;
  variants: number;
  channels: number;
}

const ProductsPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const selectAllCheckboxRef = useRef<HTMLInputElement>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      // Add mock data for new columns
      const productsWithMockData = data.map((p: any) => ({
        ...p,
        category: 'Tank Tops',
        variants: 6,
        channels: 2
      }));
      setProducts(productsWithMockData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => statusFilter === 'All' || p.status.toLowerCase() === statusFilter.toLowerCase())
      .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [products, statusFilter, searchTerm]);

  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      selectAllCheckboxRef.current.indeterminate =
        selectedProducts.length > 0 && selectedProducts.length < filteredProducts.length;
    }
  }, [selectedProducts, filteredProducts]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedProducts(e.target.checked ? filteredProducts.map((p) => p.id) : []);
  };

  const handleSelectOne = (e: React.ChangeEvent<HTMLInputElement>, productId: number) => {
    setSelectedProducts((prev) =>
      e.target.checked ? [...prev, productId] : prev.filter((id) => id !== productId)
    );
  };

  const handleDelete = async (productIds: number[]) => {
    const actionWord = productIds.length > 1 ? 'products' : 'product';
    if (!confirm(`Are you sure you want to delete the selected ${actionWord}?`)) return;

    try {
      await Promise.all(productIds.map((id) => fetch(`/api/products/${id}`, { method: 'DELETE' })));
      await fetchProducts();
      setSelectedProducts([]);
    } catch (error) {
      console.error(error);
      alert(`Could not delete the ${actionWord}.`);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-700 ring-green-600/20',
      draft: 'bg-yellow-100 text-yellow-800 ring-yellow-600/20',
      archived: 'bg-gray-100 text-gray-600 ring-gray-500/10'
    };
    const key = status.toLowerCase() as keyof typeof styles;
    return (
      <span
        className={clsx(
          'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium capitalize ring-1 ring-inset',
          styles[key] || styles.archived
        )}
      >
        {status}
      </span>
    );
  };

  const columns = useMemo(
    () => [
      {
        key: 'checkbox',
        label: (
          <input
            ref={selectAllCheckboxRef}
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            checked={filteredProducts.length > 0 && selectedProducts.length === filteredProducts.length}
            onChange={handleSelectAll}
          />
        ),
        render: (p: Product) => (
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            checked={selectedProducts.includes(p.id)}
            onChange={(e) => handleSelectOne(e, p.id)}
            onClick={(e) => e.stopPropagation()}
          />
        ),
        className: 'w-12' // Make checkbox column smaller
      },
      {
        key: 'product',
        label: 'Product',
        render: (p: Product) => (
          <div className="flex items-center gap-3">
            {p.imageUrl ? (
              <Image
                src={p.imageUrl}
                alt={p.name}
                width={40}
                height={40}
                className="h-10 w-10 rounded-md object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-md bg-gray-200" />
            )}
            <span className="font-medium text-gray-900">{p.name}</span>
          </div>
        )
      },
      { key: 'status', label: 'Status', render: (p: Product) => getStatusBadge(p.status) },
      {
        key: 'inventory',
        label: 'Inventory',
        render: (p: Product) => (
          <span className="text-gray-600">{`${
            p.inventory || 0
          } in stock for ${p.variants} variants`}</span>
        )
      },
      {
        key: 'category',
        label: 'Category',
        render: (p: Product) => <span className="text-gray-600">{p.category}</span>
      },
      {
        key: 'channels',
        label: 'Channels',
        render: (p: Product) => <span className="text-gray-600">{p.channels}</span>
      },
      {
        key: 'actions',
        label: '',
        render: (p: Product) => (
          <div className="flex items-center justify-end gap-2 text-gray-400">
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/dashboard/products/${p.id}/edit`);
              }}
              className="hover:text-gray-700"
              title="Edit Product"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete([p.id]);
              }}
              className="hover:text-red-600"
              title="Delete Product"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        ),
        className: 'w-20'
      }
    ],
    [router, filteredProducts, selectedProducts]
  );

  const FilterTabs = () => (
    <div className="border-b border-gray-200 px-4"> {/* Add padding here */}
      <nav className="-mb-px flex space-x-6" aria-label="Tabs">
        {['All', 'Active', 'Draft', 'Archived'].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={clsx(
              'whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium',
              statusFilter === tab
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            )}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );

  return (
    <div>
      <Header title="Products">
        <div className="flex items-center gap-2">
          <button className="rounded-md border bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50">
            Export
          </button>
          <button className="rounded-md border bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50">
            Import
          </button>
          <button
            onClick={() => router.push('/dashboard/products/new')}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            <PlusIcon className="-ml-0.5 h-5 w-5" />
            Add Product
          </button>
        </div>
      </Header>

      <div className="mt-6 rounded-lg border bg-white shadow-sm">
        <div className="p-4">
          <div className="relative">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <FilterTabs />

        <div className="overflow-x-auto">
          <DataTable
            data={filteredProducts}
            columns={columns}
            loading={loading}
            onRowClick={(product) => router.push(`/dashboard/products/${product.id}/edit`)}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;