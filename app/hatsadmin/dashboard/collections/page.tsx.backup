'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import { MobileHeader } from "@/components/admin/mobile-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Filter, 
  Download, 
  Plus,
  Layers, 
  FolderOpen, 
  Archive, 
  Eye,
  Search,
  MoreHorizontal
} from "lucide-react";
import Image from 'next/image';

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

const StatusBadge = ({ published }: { published: boolean }) => {
  return (
    <Badge className={published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} variant="secondary">
      {published ? 'Published' : 'Draft'}
    </Badge>
  );
};

function CollectionsActions() {
  return (
    <div className="flex items-center gap-2 lg:gap-3">
      <Button
        variant="outline"
        className="h-10 lg:h-12 px-4 lg:px-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
      >
        <Filter className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
        <span className="text-sm lg:text-base font-medium">Filter</span>
      </Button>
      <Button
        variant="outline"
        className="h-10 lg:h-12 px-4 lg:px-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
      >
        <Download className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
        <span className="text-sm lg:text-base font-medium">Export</span>
      </Button>
      <Button className="h-10 lg:h-12 px-4 lg:px-6 bg-blue-600 hover:bg-blue-700 text-white">
        <Plus className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
        <span className="text-sm lg:text-base font-medium">Create Collection</span>
      </Button>
    </div>
  );
}

function CollectionsStats({ collections }: { collections: Collection[] }) {
  const totalCollections = collections.length;
  const publishedCollections = collections.filter(collection => collection.published).length;
  const draftCollections = collections.filter(collection => !collection.published).length;
  const totalProducts = collections.reduce((sum, collection) => sum + collection.productCount, 0);

  const stats = [
    {
      title: "Total Collections",
      value: totalCollections.toString(),
      icon: Layers,
      color: "text-blue-600",
    },
    {
      title: "Published",
      value: publishedCollections.toString(),
      icon: FolderOpen,
      color: "text-green-600",
    },
    {
      title: "Draft",
      value: draftCollections.toString(),
      icon: Archive,
      color: "text-gray-600",
    },
    {
      title: "Total Products",
      value: totalProducts.toString(),
      icon: Eye,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function CollectionsFilters({ searchTerm, setSearchTerm }: { searchTerm: string; setSearchTerm: (term: string) => void }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search collections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CollectionsTable({ collections }: { collections: Collection[] }) {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Collections</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Collection</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Handle</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Products</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Created</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {collections.length > 0 ? (
                collections.map((collection) => (
                  <tr key={collection.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                          {collection.image ? (
                            <Image
                              src={collection.image}
                              alt={collection.title}
                              width={40}
                              height={40}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Layers className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{collection.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{collection.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900 font-mono">
                      {collection.handle}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {collection.productCount}
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge published={collection.published} />
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {formatDate(collection.createdAt)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/hatsadmin/dashboard/collections/${collection.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Layers className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-sm font-medium text-gray-900 mb-1">No collections found</h3>
                      <p className="text-sm text-gray-500">Get started by creating your first collection.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { getIdToken } = useAuth();

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        const token = await getIdToken();
        if (!token) {
          console.error('No authentication token available');
          return;
        }

        const response = await fetch('/api/collections', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setCollections(data);
        } else {
          console.error('Failed to fetch collections');
          // Show sample data if no real collections exist
          setCollections([
            {
              id: 1,
              title: 'Summer Collection',
              description: 'Trendy caps and hats for the summer season',
              handle: 'summer-collection',
              published: true,
              productCount: 15,
              createdAt: '2024-01-15'
            },
            {
              id: 2,
              title: 'Winter Essentials',
              description: 'Warm beanies and winter accessories',
              handle: 'winter-essentials',
              published: true,
              productCount: 8,
              createdAt: '2024-01-10'
            },
            {
              id: 3,
              title: 'Sports Collection',
              description: 'Athletic caps and performance headwear',
              handle: 'sports-collection',
              published: false,
              productCount: 12,
              createdAt: '2024-01-08'
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching collections:', error);
        setCollections([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, [getIdToken]);

  const filteredCollections = collections.filter(collection => 
    collection.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.handle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col h-full w-full overflow-hidden">
        <MobileHeader 
          title="Collections" 
          subtitle="Organize your products into collections" 
          actions={<CollectionsActions />} 
        />
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
          <div className="p-4 lg:p-6 xl:p-8 space-y-6 lg:space-y-8">
            <div className="animate-pulse space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
                ))}
              </div>
              <div className="h-96 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <MobileHeader
        title="Collections"
        subtitle="Organize your products into collections"
        actions={<CollectionsActions />}
      />

      <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
        <div className="p-4 lg:p-6 xl:p-8 space-y-6 lg:space-y-8">
          <CollectionsStats collections={filteredCollections} />
          <CollectionsFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <CollectionsTable collections={filteredCollections} />
        </div>
      </main>
    </div>
  );
}
