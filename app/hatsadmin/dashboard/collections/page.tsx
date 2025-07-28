'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon, FolderIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface Collection {
  id: number;
  title: string;
  description: string;
  handle: string;
  published: boolean;
  productCount: number;
  image?: string;
  createdAt: string;
}

export default function CollectionsPage() {
  const router = useRouter();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/collections');
      if (!response.ok) {
        throw new Error('Failed to fetch collections');
      }
      const data = await response.json();
      // Map the API response to our interface format
      const formattedCollections: Collection[] = data.map((collection: any) => ({
        id: collection.id,
        title: collection.title,
        description: collection.description || '',
        handle: collection.handle,
        published: collection.published || true,
        productCount: collection.productCount || 0,
        image: collection.imageUrl,
        createdAt: collection.createdAt || new Date().toISOString()
      }));
      setCollections(formattedCollections);
    } catch (error) {
      console.error('Error fetching collections:', error);
      // Fallback to mock data if API fails
      setCollections([
        {
          id: 1,
          title: 'Featured Products',
          description: 'Our top selling and featured items',
          handle: 'featured-products',
          published: true,
          productCount: 12,
          createdAt: '2024-01-15T00:00:00.000Z'
        },
        {
          id: 2,
          title: 'Summer Collection',
          description: 'Light and breezy items perfect for summer',
          handle: 'summer-collection',
          published: true,
          productCount: 8,
          createdAt: '2024-02-01T00:00:00.000Z'
        },
        {
          id: 3,
          title: 'New Arrivals',
          description: 'Latest products added to our inventory',
          handle: 'new-arrivals',
          published: false,
          productCount: 5,
          createdAt: '2024-03-01T00:00:00.000Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCollections = collections.filter(collection =>
    collection.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Collections</h1>
          <p className="text-sm text-gray-500 mt-1">Group your products into collections</p>
        </div>
        <button
          onClick={() => router.push('/hatsadmin/dashboard/collections/new')}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 w-full sm:w-auto"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Create collection
        </button>
      </div>

      {/* Collections Management Card */}
      <div className="mt-8 rounded-lg border bg-white shadow-sm">
        {/* Search Section */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="relative">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search collections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-sm transition-colors"
            />
          </div>
        </div>

        {/* Collections List */}
        <div className="overflow-hidden">
          {loading ? (
            <div className="p-6 sm:p-12 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-600 mx-auto"></div>
              <p className="mt-3 text-sm text-gray-500">Loading collections...</p>
            </div>
          ) : filteredCollections.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <FolderIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No collections</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new collection.</p>
              <div className="mt-6">
                <button
                  onClick={() => router.push('/hatsadmin/dashboard/collections/new')}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-black hover:bg-gray-800"
                >
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                  Create collection
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredCollections.map((collection) => (
                <div
                  key={collection.id}
                  className="p-4 sm:p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => router.push(`/hatsadmin/dashboard/collections/${collection.id}`)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                        {collection.image ? (
                          <img
                            src={collection.image}
                            alt={collection.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <FolderIcon className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {collection.title}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {collection.description || 'No description'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4 ml-4">
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {collection.productCount} products
                            </p>
                            <p className="text-xs text-gray-500">
                              {collection.published ? 'Published' : 'Draft'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
