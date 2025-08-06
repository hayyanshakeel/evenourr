'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormLayout } from '@/components/admin/form-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Save, Upload, X } from 'lucide-react';

export default function NewCollectionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    handle: '',
    image: null as File | null,
    metaTitle: '',
    metaDescription: '',
    published: true,
    collectType: 'manual' as 'manual' | 'automated',
    conditions: [] as any[]
  });

  const handleBack = () => {
    router.push('/hatsadmin/dashboard/collections');
  };

  const handleTitleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      title: value,
      handle: prev.handle || value.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/collections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          handle: formData.handle,
          description: formData.description,
          imageUrl: formData.image ? URL.createObjectURL(formData.image) : null,
          published: formData.published,
          metaTitle: formData.metaTitle,
          metaDescription: formData.metaDescription
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create collection');
      }

      router.push('/hatsadmin/dashboard/collections');
    } catch (error) {
      console.error('Error creating collection:', error);
    } finally {
      setLoading(false);
    }
  };

  const actions = (
    <>
      <Button variant="outline" onClick={handleBack} disabled={loading}>
        Cancel
      </Button>
      <Button onClick={handleSubmit} disabled={loading || !formData.title.trim()} className="bg-blue-600 hover:bg-blue-700">
        <Save className="h-4 w-4 mr-2" />
        {loading ? 'Creating...' : 'Create Collection'}
      </Button>
    </>
  );

  return (
    <FormLayout
      title="New Collection"
      subtitle="Create a new collection to organize your products"
      onBack={handleBack}
      actions={actions}
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Collection Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter collection title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe this collection..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="handle">Handle (URL)</Label>
                <Input
                  id="handle"
                  value={formData.handle}
                  onChange={(e) => setFormData(prev => ({ ...prev, handle: e.target.value }))}
                  placeholder="collection-url-handle"
                />
                <p className="text-sm text-gray-500">
                  This will be used in the URL: /collections/{formData.handle || 'your-handle'}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Collection Image */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Collection Image</h3>
            <div className="space-y-4">
              {imagePreview ? (
                <div className="relative w-32 h-32">
                  <img
                    src={imagePreview}
                    alt="Collection preview"
                    className="w-full h-full object-cover rounded-lg border border-gray-200"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full bg-white shadow-md hover:bg-gray-50"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-2">Upload a collection image</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('image-upload')?.click()}
                  >
                    Choose File
                  </Button>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Visibility */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Visibility</h3>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Published</Label>
                <p className="text-sm text-gray-500">Collection is visible to customers</p>
              </div>
              <Switch
                checked={formData.published}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
              />
            </div>
          </div>

          <Separator />

          {/* SEO Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                  placeholder="SEO title for search engines"
                />
                <p className="text-sm text-gray-500">
                  {formData.metaTitle.length}/60 characters recommended
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                  placeholder="SEO description for search engines"
                  rows={3}
                />
                <p className="text-sm text-gray-500">
                  {formData.metaDescription.length}/160 characters recommended
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </FormLayout>
  );
}
