'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormLayout } from '@/components/admin/form-layout';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save } from 'lucide-react';

export default function NewCategoryPage() {
  const router = useRouter();
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
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/hatsadmin/dashboard/products/categories');
      } else {
        console.error('Failed to create category');
      }
    } catch (error) {
      console.error('Error creating category:', error);
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
      <Button variant="outline" onClick={handleBack} disabled={loading}>
        Cancel
      </Button>
      <Button onClick={handleSubmit} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
        <Save className="h-4 w-4 mr-2" />
        {loading ? 'Creating...' : 'Create Category'}
      </Button>
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
