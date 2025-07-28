'use client';

import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@prisma/client';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

// This interface defines the props the component accepts.
interface ProductFormProps {
  initialData?: Product;
}

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  
  // State for form fields, initialized with existing data if available.
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price?.toString() || '',
    inventory: initialData?.inventory?.toString() || '',
    status: initialData?.status || 'draft',
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [categoryId, setCategoryId] = useState<string>(initialData?.categoryId ? String(initialData.categoryId) : '');

  const fetchCategories = async () => {
    console.log('ProductForm: Starting to fetch categories...');
    try {
      const res = await fetch('/api/categories', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        }
      });
      console.log('ProductForm: Categories response status:', res.status);
      if (!res.ok) {
        throw new Error(`Failed to fetch categories: ${res.status}`);
      }
      const data = await res.json();
      console.log('ProductForm: Categories loaded:', data);
      setCategories(data);
    } catch (err) {
      console.error('ProductForm: Error fetching categories:', err);
      setError('Failed to load categories');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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

  // Remove image preview
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
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
    data.append('categoryId', categoryId ? String(categoryId) : '');

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

      router.push('/hatsadmin/dashboard/products');
      router.refresh();

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Product Title and Description */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Product information</h3>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Short sleeve t-shirt"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                    placeholder="Describe your product in a few words..."
                  />
                </div>
              </div>
            </div>

            {/* Media */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Media</h3>
              </div>
              <div className="p-6">
                {imagePreview ? (
                  <div className="relative">
                    <div className="relative w-full h-64 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full">
                    <label htmlFor="image" className="cursor-pointer">
                      <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <PhotoIcon className="w-10 h-10 mb-3 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                        </div>
                      </div>
                    </label>
                    <input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Pricing</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-900 mb-2">
                      Price
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="inventory" className="block text-sm font-medium text-gray-900 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      id="inventory"
                      name="inventory"
                      value={formData.inventory}
                      onChange={handleChange}
                      min="0"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Product status</h3>
              </div>
              <div className="p-6">
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Product Organization */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Product organization</h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-900">
                      Product category
                    </label>
                    <button
                      type="button"
                      onClick={fetchCategories}
                      className="text-xs text-blue-600 hover:text-blue-500"
                    >
                      Refresh
                    </button>
                  </div>
                  <select
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={categoryId}
                    onChange={e => setCategoryId(e.target.value)}
                    name="categoryId"
                  >
                    <option value="">Select category</option>
                    {categories.length > 0 ? (
                      categories.map(cat => (
                        <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                      ))
                    ) : (
                      <option value="" disabled>Loading categories...</option>
                    )}
                  </select>
                  <div className="mt-1 text-xs text-gray-500">
                    Categories loaded: {categories.length}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Add tags separated by commas"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <XMarkIcon className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : initialData ? 'Save product' : 'Save product'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;