// app/(admin)/dashboard/collections/page.tsx

'use client';

import { useEffect, useState, useMemo } from 'react';
import Header from '@/components/admin/header';
import DataTable from '@/components/admin/data-table';
import { PlusIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

// Define the Collection type based on your schema
interface Collection {
  id: number;
  title: string;
  handle: string;
  description: string | null;
  imageUrl: string | null;
  product_count?: number; // Optional: To be implemented later
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/collections');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setCollections(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

  const columns = useMemo(
    () => [
      {
        key: 'collection',
        label: 'Collection',
        render: (c: Collection) => (
            <div className="flex items-center gap-3">
                {c.imageUrl ? (
                    <Image src={c.imageUrl} alt={c.title} width={40} height={40} className="h-10 w-10 rounded-md object-cover" />
                ) : (
                    <div className="h-10 w-10 rounded-md bg-gray-100"></div>
                )}
                <span className="font-medium text-gray-900">{c.title}</span>
            </div>
        )
      },
      {
        key: 'handle',
        label: 'Handle',
        render: (c: Collection) => <span className="text-gray-600">/collections/{c.handle}</span>
      },
      {
        key: 'product_count',
        label: 'Products',
        render: (c: Collection) => <span className="text-gray-600">{c.product_count ?? '0'}</span> // Placeholder
      }
    ],
    []
  );

  return (
    <div>
      <Header title="Collections">
        <button
          type="button"
          className="inline-flex items-center gap-x-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <PlusIcon className="-ml-0.5 h-5 w-5" />
          Add Collection
        </button>
      </Header>
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
           <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg border bg-white shadow-sm">
                    {error && <div className="p-4 text-red-600">{error}</div>}
                    <DataTable columns={columns} data={collections} loading={loading} />
                </div>
           </div>
        </div>
      </div>
    </div>
  );
}