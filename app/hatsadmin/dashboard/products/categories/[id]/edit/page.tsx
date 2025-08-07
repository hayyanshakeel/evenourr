'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, X, Trash2 } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const { makeAuthenticatedRequest } = useAdminAuth();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
  });

  useEffect(() => {
    if (params.id) {
      fetchCategory();
    }
  }, [params.id]);

  const fetchCategory = async () => {
    try {
      const response = await makeAuthenticatedRequest(`/api/admin/categories/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setCategory(data);
        setFormData({
          name: data.name || '',
        });
      }
    } catch (error) {
      console.error('Error fetching category:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await makeAuthenticatedRequest(`/api/admin/categories/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/hatsadmin/dashboard/products/categories');
      } else {
        console.error('Failed to update category');
      }
    } catch (error) {
      console.error('Error updating category:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      const response = await makeAuthenticatedRequest(`/api/admin/categories/${params.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/hatsadmin/dashboard/products/categories');
      } else {
        console.error('Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!category) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse">Loading category...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm mb-6">
          <div className="px-4 lg:px-6 xl:px-8 py-6 lg:py-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
              
              {/* Title Section */}
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => router.back()}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                    Edit Category
                  </h1>
                  <p className="mt-2 text-sm lg:text-base text-gray-600 leading-relaxed">
                    Update category information
                  </p>
                </div>
              </div>

              {/* Actions Section */}
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  onClick={handleDelete}
                  disabled={deleting}
                  className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {deleting ? 'Deleting...' : 'Delete'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => router.back()}
                  className="border-slate-300 hover:border-slate-400 hover:bg-slate-50"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={loading || !formData.name.trim()}
                  className="bg-slate-900 hover:bg-slate-800 text-white border border-slate-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Category Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter category name"
                    required
                  />
                </div>

                {category && (
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <Label className="text-sm text-gray-500">Created</Label>
                      <p className="text-sm font-medium">
                        {new Date(category.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Last Updated</Label>
                      <p className="text-sm font-medium">
                        {new Date(category.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="black"
                  disabled={loading || !formData.name.trim()}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
