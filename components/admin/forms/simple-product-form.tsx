'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PhotoIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import VariantsManager from './variants-manager';
import { formatCurrency, CURRENCIES } from '@/lib/currencies';
import { useSettings } from '@/hooks/useSettings';
import { useAdminAuth } from '@/hooks/useAdminAuth';

interface SimpleProductFormProps {
  initialData?: any;
}

interface ProductOption {
  name: string;
  values: string[];
}

interface ProductVariant {
  id?: number;
  title: string;
  price: number;
  compareAtPrice?: number;
  sku?: string;
  inventory: number;
  combinations: Record<string, string>;
}

function SimpleProductForm({ initialData }: SimpleProductFormProps) {
  const router = useRouter();
  const { makeAuthenticatedRequest } = useAdminAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [collections, setCollections] = useState<{ id: number; title: string }[]>([]);
  const [categoryId, setCategoryId] = useState<string>(initialData?.categoryId ? String(initialData.categoryId) : '');
  const [selectedCollections, setSelectedCollections] = useState<number[]>(
    initialData?.productsToCollections?.map((ptc: any) => ptc.collectionId) || []
  );
  const { currency } = useSettings();
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price?.toString() || '',
    inventory: initialData?.inventory?.toString() || '',
    status: initialData?.status || 'active',
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    initialData?.images && initialData.images.length > 0 
      ? initialData.images.map((img: any) => img.imageUrl)
      : initialData?.imageUrl 
        ? [initialData.imageUrl] 
        : []
  );
  
  // Variants state
  const [options, setOptions] = useState<ProductOption[]>(initialData?.options || []);
  const [variants, setVariants] = useState<ProductVariant[]>(initialData?.variants || []);

  // Fetch categories and collections on component mount
  useEffect(() => {
    // Fetch categories
    makeAuthenticatedRequest('/api/admin/categories')
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch categories: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setCategories(data);
      })
      .catch(err => {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
      });

    // Fetch collections
    makeAuthenticatedRequest('/api/admin/collections')
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch collections: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setCollections(data);
      })
      .catch(err => {
        console.error('Error fetching collections:', err);
        setError('Failed to load collections');
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Generate slug from name
      const slug = formData.name
        ? formData.name
            .toLowerCase()
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single
            .trim()
        : '';

      const productData = {
        name: formData.name,
        description: formData.description || '',
        price: parseFloat(formData.price),
        inventory: parseInt(formData.inventory),
        status: formData.status,
        slug: slug,
        categoryId: categoryId ? parseInt(categoryId) : undefined,
        collectionIds: selectedCollections,
        // For now, use the first image URL if available
        imageUrl: imagePreviews.length > 0 ? imagePreviews[0] : undefined,
      };
      
      console.log('Product data before submission:', productData);

      let response;
      if (initialData?.id) {
        // Update existing product
        response = await makeAuthenticatedRequest(`/api/admin/products/${initialData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        });
      } else {
        // Create new product
        response = await makeAuthenticatedRequest('/api/admin/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save product');
      }

      const result = await response.json();
      console.log('Product saved successfully:', result);
      
      // Redirect back to products page
      router.push('/hatsadmin/dashboard/products');
    } catch (error) {
      console.error('Error saving product:', error);
      setError(error instanceof Error ? error.message : 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCollectionToggle = (collectionId: number) => {
    setSelectedCollections(prev => 
      prev.includes(collectionId) 
        ? prev.filter(id => id !== collectionId)
        : [...prev, collectionId]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setImageFiles(prev => [...prev, ...newFiles]);

      // Generate previews for new files
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const moveImage = (dragIndex: number, hoverIndex: number) => {
    if (dragIndex >= imagePreviews.length || hoverIndex >= imagePreviews.length) return;
    
    const draggedImage = imagePreviews[dragIndex];
    const draggedFile = imageFiles[dragIndex];
    
    if (!draggedImage) return;
    
    const updatedPreviews = [...imagePreviews];
    const updatedFiles = [...imageFiles];
    
    updatedPreviews.splice(dragIndex, 1);
    updatedPreviews.splice(hoverIndex, 0, draggedImage);
    
    if (draggedFile) {
      updatedFiles.splice(dragIndex, 1);
      updatedFiles.splice(hoverIndex, 0, draggedFile);
    }
    
    setImagePreviews(updatedPreviews);
    setImageFiles(updatedFiles);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Main Content Area */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* Product Title and Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Product information</h3>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-3">
                    Title
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-sm transition-colors"
                    placeholder="Short sleeve t-shirt"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-3">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-sm resize-none transition-colors"
                    placeholder="Describe your product in a few words..."
                  />
                </div>
              </div>
            </div>

            {/* Media */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Media</h3>
              </div>
              <div className="p-6">
                {imagePreviews.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <div className="relative w-full h-32 rounded-lg border-2 border-gray-200 overflow-hidden">
                            <img
                              src={preview}
                              alt={`Product image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            {index === 0 && (
                              <div className="absolute top-2 left-2 px-2 py-1 bg-black text-white text-xs font-semibold rounded">
                                Main
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                            <div className="absolute bottom-2 left-2 px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded">
                              {index + 1}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">The first image will be used as the main product image.</p>
                    <div className="w-full">
                      <label htmlFor="image" className="cursor-pointer">
                        <div className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                          <PhotoIcon className="w-6 h-6 mb-2 text-gray-400" />
                          <p className="text-sm text-gray-500">Add more images</p>
                        </div>
                      </label>
                      <input
                        id="image"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="w-full">
                    <label htmlFor="image" className="cursor-pointer">
                      <div className="flex flex-col items-center justify-center w-full h-80 sm:h-96 border-2 border-gray-300 border-dashed rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <PhotoIcon className="w-12 h-12 mb-4 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">Add multiple images. SVG, PNG, JPG or GIF (MAX. 800x400px each)</p>
                        </div>
                      </div>
                    </label>
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Pricing</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="price" className="block text-sm font-semibold text-gray-900 mb-3">
                      Price
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-gray-500 text-sm font-medium">
                          {CURRENCIES[currency]?.symbol || '$'}
                        </span>
                      </div>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        className="block w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-sm transition-colors"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="inventory" className="block text-sm font-semibold text-gray-900 mb-3">
                      Quantity
                    </label>
                    <input
                      type="number"
                      id="inventory"
                      name="inventory"
                      value={formData.inventory}
                      onChange={handleChange}
                      min="0"
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-sm transition-colors"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Variants */}
            <VariantsManager
              options={options}
              variants={variants}
              basePrice={Number(formData.price) || 0}
              onOptionsChange={setOptions}
              onVariantsChange={setVariants}
            />

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Product status</h3>
              </div>
              <div className="p-6">
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-sm transition-colors"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Product Organization */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Product organization</h3>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Product category
                  </label>
                  <select 
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-sm transition-colors"
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
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Collections
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3">
                    {collections.length > 0 ? (
                      collections.map(collection => (
                        <label key={collection.id} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedCollections.includes(collection.id)}
                            onChange={() => handleCollectionToggle(collection.id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          <span className="text-sm text-gray-700">{collection.title}</span>
                        </label>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No collections available</p>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Select the collections this product should appear in</p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Tags
                  </label>
                  <input
                    type="text"
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-sm transition-colors"
                    placeholder="Add tags separated by commas"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
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
        <div className="flex flex-col sm:flex-row items-center justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-white bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting 
              ? 'Saving...' 
              : (initialData ? 'Save product' : 'Save product')
            }
          </button>
        </div>
      </form>
    </div>
  );
}

export default SimpleProductForm;
