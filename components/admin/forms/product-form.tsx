'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/types';
import { PhotoIcon } from '@heroicons/react/24/outline';

// This interface defines the props the component accepts.
// 'initialData' is used when editing an existing product.
interface ProductFormProps {
  initialData?: Product;
  productId?: number;
}

export default function ProductForm({ initialData, productId }: ProductFormProps) {
  const router = useRouter();
  
  // State for form fields, initialized with existing data if available.
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price?.toString() || '',
    inventory: initialData?.inventory?.toString() || '',
    status: initialData?.status || 'draft',
    vendor: initialData?.vendor || '',
    collections: initialData?.collections || '',
    tags: initialData?.tags || '',
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handles changes in text inputs, textareas, and selects.
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handles image file selection and creates a preview.
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handles the form submission.
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!imageFile && !initialData) {
        setError('An image is required for a new product.');
        return;
    }
    
    setIsSubmitting(true);
    setError(null);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('inventory', formData.inventory);
    data.append('status', formData.status);
    data.append('vendor', formData.vendor);
    data.append('collections', formData.collections);
    data.append('tags', formData.tags);

    if (imageFile) {
        data.append('image', imageFile);
    }
    
    // Determine if we are creating or updating a product.
    const method = initialData ? 'PUT' : 'POST';
    const url = initialData ? `/api/products/${initialData.id}` : '/api/products';

    try {
      const response = await fetch(url, {
        method,
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }

      router.push('/dashboard/products');
      router.refresh();

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="md:col-span-2 space-y-6">
          {/* Product Information Card */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm" data-v0-t="card">
            <div className="p-6 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Title</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={5} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
              </div>
            </div>
          </div>

          {/* Media Card */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm" data-v0-t="card">
            <div className="p-6">
               <label className="block text-sm font-medium text-gray-700 mb-2">Media</label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                        {imagePreview ? (
                            <img src={imagePreview} alt="Product preview" className="mx-auto h-32 w-32 object-cover rounded-md" />
                        ) : (
                            <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                        )}
                        <div className="mt-4 flex text-sm leading-6 text-gray-600">
                            <label htmlFor="image-upload" className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500">
                                <span>Upload a file</span>
                                <input id="image-upload" name="image" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                    </div>
                </div>
            </div>
          </div>

          {/* Pricing & Inventory Card */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm" data-v0-t="card">
            <div className="p-6">
                <h3 className="text-lg font-medium">Pricing & Inventory</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                    <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required step="0.01" />
                  </div>
                  <div>
                    <label htmlFor="inventory" className="block text-sm font-medium text-gray-700">Inventory</label>
                    <input type="number" id="inventory" name="inventory" value={formData.inventory} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                  </div>
                </div>
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="md:col-span-1 space-y-6">
          {/* Status Card */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm" data-v0-t="card">
            <div className="p-6">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                <select id="status" name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
            </div>
          </div>

          {/* Product Organization Card */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm" data-v0-t="card">
             <div className="p-6">
                <h3 className="text-lg font-medium mb-4">Product organization</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="vendor" className="block text-sm font-medium text-gray-700">Vendor</label>
                    <input type="text" id="vendor" name="vendor" value={formData.vendor} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                  </div>
                  <div>
                    <label htmlFor="collections" className="block text-sm font-medium text-gray-700">Collections</label>
                    <input type="text" id="collections" name="collections" value={formData.collections} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                  </div>
                   <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags</label>
                    <input type="text" id="tags" name="tags" value={formData.tags} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="mt-6 flex justify-end gap-4">
        <button type="button" onClick={() => router.back()} className="rounded-md border bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50">
          {isSubmitting ? 'Saving...' : 'Save Product'}
        </button>
      </div>
      {error && <p className="mt-4 text-right text-sm text-red-600">{error}</p>}
    </form>
  );
}