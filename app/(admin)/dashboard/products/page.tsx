'use client';

import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/admin/header';
import DataTable from '@/components/admin/data-table';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import clsx from 'clsx';

interface Product {
  id: number;
  name: string;
  status: string;
  price: number;
  inventory: number;
  imageUrl: string | null;
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
      setProducts(data);
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
      const isIndeterminate =
        selectedProducts.length > 0 && selectedProducts.length < filteredProducts.length;
      selectAllCheckboxRef.current.indeterminate = isIndeterminate;
    }
  }, [selectedProducts, filteredProducts]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProducts(filteredProducts.map((p) => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectOne = (e: React.ChangeEvent<HTMLInputElement>, productId: number) => {
    if (e.target.checked) {
      setSelectedProducts((prev) => [...prev, productId]);
    } else {
      setSelectedProducts((prev) => prev.filter((id) => id !== productId));
    }
  };

  const handleDelete = async (productIds: number[]) => {
    const actionWord = productIds.length > 1 ? 'products' : 'product';
    if (!confirm(`Are you sure you want to delete the selected ${actionWord}? This cannot be undone.`))
      return;

    try {
      await Promise.all(productIds.map((id) => fetch(`/api/products/${id}`, { method: 'DELETE' })));
      await fetchProducts();
      setSelectedProducts([]);
    } catch (error) {
      console.error(error);
      alert(`Could not delete the selected ${actionWord}.`);
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount / 100);

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
          'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
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
        className: 'w-12 text-center'
      },
      {
        key: 'image',
        label: 'Image',
        render: (p: Product) =>
          p.imageUrl ? (
            <Image
              src={p.imageUrl}
              alt={p.name}
              width={40}
              height={40}
              className="h-10 w-10 rounded-md object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-md bg-gray-200" />
          ),
        className: 'w-20'
      },
      {
        key: 'name',
        label: 'Product Name',
        render: (p: Product) => <span className="font-medium text-gray-900">{p.name}</span>
      },
      { key: 'status', label: 'Status', render: (p: Product) => getStatusBadge(p.status), className: 'w-32' },
      {
        key: 'inventory',
        label: 'Inventory',
        render: (p: Product) => <span className="text-gray-600">{`${p.inventory || 0} in stock`}</span>,
        className: 'w-40'
      },
      {
        key: 'price',
        label: 'Price',
        render: (p: Product) => <span className="text-gray-600">{formatCurrency(p.price)}</span>,
        className: 'w-32'
      },
      {
        key: 'actions',
        label: '',
        render: (p: Product) => (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/dashboard/products/${p.id}/edit`);
              }}
              className="rounded p-1 text-gray-400 hover:text-gray-700"
              title="Edit Product"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete([p.id]);
              }}
              className="rounded p-1 text-gray-400 hover:text-red-600"
              title="Delete Product"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        ),
        className: 'w-24'
      }
    ],
    [router, filteredProducts, selectedProducts]
  );

  const FilterTabs = () => (
    <div className="border-b border-gray-200">
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
      <div className="rounded-lg border bg-white shadow-sm">
        <div className="px-4 pt-2">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border-0 py-2 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
          <FilterTabs />
        </div>

        {selectedProducts.length > 0 && (
          <div className="flex h-12 items-center justify-between border-b bg-gray-50 px-4">
            <p className="text-sm font-medium text-gray-700">{selectedProducts.length} selected</p>
            <button
              onClick={() => handleDelete(selectedProducts)}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              <TrashIcon className="h-4 w-4" />
              Delete selected
            </button>
          </div>
        )}

        <DataTable
          columns={columns}
          data={filteredProducts}
          loading={loading}
          onRowClick={(p) => router.push(`/dashboard/products/${p.id}/edit`)}
          emptyMessage="No products match your filters."
        />
      </div>
    </div>
  );
};

export default ProductsPage;