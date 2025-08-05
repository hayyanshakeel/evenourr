'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MagnifyingGlassIcon, 
  FolderIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

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
  const [statusFilter, setStatusFilter] = useState<string>('all');

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

  const filteredCollections = collections.filter(collection => {
    const matchesSearch = collection.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         collection.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'published' && collection.published) ||
      (statusFilter === 'draft' && !collection.published);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
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
      <div className="rounded-lg border bg-white shadow-sm">
        {/* Search and Filter Section */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search collections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-sm"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-sm sm:max-w-xs"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Collections Table */}
        <div className="overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Loading collections...</p>
            </div>
          ) : filteredCollections.length === 0 ? (
            <div className="p-8 text-center">
              <FolderIcon className="mx-auto h-10 w-10 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No collections found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Collection
                  </th>
                  <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Handle
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Products
                  </th>
                  <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCollections.map((collection) => (
                  <tr 
                    key={collection.id} 
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => router.push(`/hatsadmin/dashboard/collections/${collection.id}`)}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                            {collection.image ? (
                              <img
                                src={collection.image}
                                alt={collection.title}
                                className="h-10 w-10 rounded-lg object-cover"
                              />
                            ) : (
                              <FolderIcon className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-semibold text-gray-900">
                            {collection.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {collection.description || 'No description'}
                          </div>
                          <div className="sm:hidden text-xs text-gray-400 mt-1">
                            Handle: {collection.handle}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {collection.handle}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        collection.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {collection.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                      {collection.productCount}
                    </td>
                    <td className="hidden md:table-cell px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {new Date(collection.createdAt).toLocaleDateString()}
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
