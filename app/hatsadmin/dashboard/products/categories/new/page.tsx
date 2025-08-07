'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormLayout } from '@/components/admin/form-layout';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, X, Plus } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export default function NewCategoryPage() {
  const router = useRouter();
  const { makeAuthenticatedRequest } = useAdminAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const handleBack = () => {
    router.push('/hatsadmin/dashboard/products/categories');
  };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await makeAuthenticatedRequest('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create category: ${response.statusText}`);
      }

      const result = await response.json();
      router.push('/hatsadmin/dashboard/products/categories');
    } catch (error) {
      console.error('Error creating category:', error);
      alert(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const actions = (
    <>
                  {/* Actions */}
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => router.push('/hatsadmin/dashboard/products/categories')}
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
                <Plus className="h-4 w-4 mr-2" />
                {loading ? 'Creating...' : 'Create Category'}
              </Button>
            </div>
    </>
  );

  return (
    <FormLayout
      title="New Category"
      subtitle="Create a new product category to organize your products"
      onBack={handleBack}
      actions={actions}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter category name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter category description (optional)"
              rows={4}
            />
          </div>
        </div>
      </form>
    </FormLayout>
  );
}
