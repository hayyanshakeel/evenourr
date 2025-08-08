'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { AdminPageLayout } from "@/components/admin/admin-page-layout"
import { AdminStatsCard } from "@/components/admin/admin-stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, Edit, Trash2, MoreHorizontal, Tag } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export default function CategoriesPage() {
  const router = useRouter();
  const { makeAuthenticatedRequest, isReady, isAuthenticated } = useAdminAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isReady && isAuthenticated) {
      fetchCategories();
    }
  }, [isReady, isAuthenticated]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      if (!isReady || !isAuthenticated) {
        return;
      }
      const response = await makeAuthenticatedRequest('/api/admin/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      const list = Array.isArray(data) ? data : (data?.data ?? []);
      setCategories(list);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCategory = () => {
    router.push('/hatsadmin/dashboard/products/categories/new');
  };

  const handleEditCategory = (id: number) => {
    router.push(`/hatsadmin/dashboard/products/categories/${id}/edit`);
  };

  const handleDeleteCategory = async (id: number) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await makeAuthenticatedRequest(`/api/admin/categories/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchCategories();
        }
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const statsCards = (
    <>
      <AdminStatsCard
        title="Total Categories"
        value={categories.length}
        icon={Tag}
        color="text-blue-500"
        bgColor="bg-blue-50"
        borderColor="border-blue-200"
      />
      <AdminStatsCard
        title="Active Categories"
        value={categories.length}
        icon={Tag}
        color="text-green-500"
        bgColor="bg-green-50"
        borderColor="border-green-200"
      />
      <AdminStatsCard
        title="Search Results"
        value={filteredCategories.length}
        icon={Search}
        color="text-purple-500"
        bgColor="bg-purple-50"
        borderColor="border-purple-200"
      />
    </>
  );

  return (
    <AdminPageLayout
      title="Categories"
      subtitle="Organize your products into categories"
      searchPlaceholder="Search categories..."
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      showFilters={false}
      showExport={false}
      addButtonText="Add Category"
      onAdd={handleAddCategory}
      statsCards={statsCards}
      loading={loading}
    >
      <Card className="admin-card">
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm 
                  ? "No categories match your search criteria." 
                  : "Get started by creating your first category."
                }
              </p>
              {!searchTerm && (
                <Button onClick={handleAddCategory}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Category
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Tag className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="font-medium">{category.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(category.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(category.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem 
                            onClick={() => handleEditCategory(category.id)}
                            className="text-slate-700 hover:bg-slate-50 focus:bg-slate-50"
                          >
                            <Edit className="h-4 w-4 mr-2 text-slate-600" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600 hover:bg-red-50 focus:bg-red-50"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </AdminPageLayout>
  );
}
