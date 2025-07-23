// app/(admin)/dashboard/inventory/page.tsx

'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import Header from '@/components/admin/header';
import DataTable from '@/components/admin/data-table';
import Image from 'next/image';

// Define the Product type based on your schema for this view
interface ProductInventory {
  id: number;
  name: string;
  inventory: number;
  imageUrl: string | null;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<ProductInventory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/products'); // Assuming you have a GET all endpoint for products
      if (!response.ok) {
        throw new Error('Failed to fetch product data');
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handler for updating inventory (to be implemented)
  const handleInventoryChange = (productId: number, newInventory: number) => {
    console.log(`Update product ${productId} with new inventory ${newInventory}`);
    // Here you would make an API call (e.g., PATCH /api/products/{id})
  };

  const columns = useMemo(
    () => [
      {
        key: 'product',
        label: 'Product',
        render: (p: ProductInventory) => (
          <div className="flex items-center gap-4">
            {p.imageUrl ? (
              <Image
                src={p.imageUrl}
                alt={p.name}
                width={40}
                height={40}
                className="h-10 w-10 rounded-md object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-md bg-gray-100"></div>
            )}
            <span className="font-medium text-gray-900">{p.name}</span>
          </div>
        )
      },
      {
        key: 'inventory',
        label: 'Stock Available',
        render: (p: ProductInventory) => (
          <input
            type="number"
            defaultValue={p.inventory}
            onBlur={(e) => handleInventoryChange(p.id, parseInt(e.target.value, 10))}
            className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            aria-label={`Stock for ${p.name}`}
          />
        )
      }
    ],
    []
  );

  return (
    <div>
      <Header title="Inventory Management" />
       <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
           <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg border bg-white shadow-sm">
                    {error && <div className="p-4 text-red-600">{error}</div>}
                    <DataTable columns={columns} data={products} loading={loading} />
                </div>
           </div>
        </div>
      </div>
    </div>
  );
}