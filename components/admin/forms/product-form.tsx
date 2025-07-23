'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { ArrowUpTrayIcon } from '@heroicons/react/24/solid';

// --- CONSOLE LOG FOR DEBUGGING ---
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

console.log('Cloudinary Cloud Name:', CLOUD_NAME);
console.log('Cloudinary Upload Preset:', UPLOAD_PRESET);
// ------------------------------------

interface ProductFormData {
  title: string;
  handle: string;
  description: string;
  price: string;
  compareAtPrice: string;
  cost: string;
  sku: string;
  barcode: string;
  inventory: number;
  weight: string;
  weightUnit: string;
  status: string;
  vendor: string;
  tags: string;
  imageUrl: string;
  seoTitle: string;
  seoDescription: string;
}

interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  productId?: number;
}


export default function ProductForm({ initialData, productId }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);
  const [formData, setFormData] = useState<ProductFormData>({
    title: initialData?.title || '',
    handle: initialData?.handle || '',
    description: initialData?.description || '',
    price: initialData?.price ? (parseFloat(initialData.price) / 100).toFixed(2) : '',
    compareAtPrice: initialData?.compareAtPrice ? (parseFloat(initialData.compareAtPrice) / 100).toFixed(2) : '',
    cost: initialData?.cost ? (parseFloat(initialData.cost) / 100).toFixed(2) : '',
    sku: initialData?.sku || '',
    barcode: initialData?.barcode || '',
    inventory: initialData?.inventory || 0,
    weight: initialData?.weight || '',
    weightUnit: initialData?.weightUnit || 'kg',
    status: initialData?.status || 'active',
    vendor: initialData?.vendor || '',
    tags: initialData?.tags || '',
    imageUrl: initialData?.imageUrl || '',
    seoTitle: initialData?.seoTitle || '',
    seoDescription: initialData?.seoDescription || ''
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles[0]) {
      const file = acceptedFiles[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.gif', '.webp'] },
    multiple: false,
  });

  const handleChange = (field: keyof ProductFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'title' && !productId) {
      const handle = value.toString().toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, handle }));
    }
  };

  const handleImageUpload = async (): Promise<string | null> => {
    if (!imageFile) return formData.imageUrl;

    const uploadFormData = new FormData();
    uploadFormData.append('file', imageFile);
    uploadFormData.append('upload_preset', UPLOAD_PRESET!);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) throw new Error('Image upload failed');
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Image upload failed. Please try again.');
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uploadedImageUrl = await handleImageUpload();
      if (uploadedImageUrl === null && imageFile) {
        setLoading(false);
        return;
      }

      const payload = {
        ...formData,
        imageUrl: uploadedImageUrl || formData.imageUrl,
        price: Math.round(parseFloat(formData.price || '0') * 100),
        compareAtPrice: formData.compareAtPrice ? Math.round(parseFloat(formData.compareAtPrice) * 100) : null,
        cost: formData.cost ? Math.round(parseFloat(formData.cost) * 100) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        inventory: parseInt(formData.inventory.toString()),
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
      };

      const url = productId ? `/api/products/${productId}` : '/api/products';
      const method = productId ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        router.push('/admin/dashboard/products');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save product');
      }
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('Failed to save product');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information Section */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Basic Information</h3>
           <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Product Title *
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="handle" className="block text-sm font-medium text-gray-700">
                URL Handle *
              </label>
              <input
                type="text"
                name="handle"
                id="handle"
                required
                value={formData.handle}
                onChange={(e) => handleChange('handle', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Image Upload Section */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Product Image</h3>
          <div className="mt-6">
            <div
              {...getRootProps()}
              className={`flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6 transition-colors ${
                isDragActive ? 'border-blue-500 bg-blue-50' : ''
              }`}
            >
              <div className="space-y-1 text-center">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Product preview"
                    width={200}
                    height={200}
                    className="mx-auto h-48 w-48 object-contain rounded-md"
                  />
                ) : (
                  <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
                )}
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500"
                  >
                    <span>Upload a file</span>
                    <input {...getInputProps()} id="file-upload" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Pricing</h3>
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price *
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="price"
                  id="price"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="compareAtPrice" className="block text-sm font-medium text-gray-700">
                Compare at Price
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="compareAtPrice"
                  id="compareAtPrice"
                  min="0"
                  step="0.01"
                  value={formData.compareAtPrice}
                  onChange={(e) => handleChange('compareAtPrice', e.target.value)}
                  className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="cost" className="block text-sm font-medium text-gray-700">
                Cost per Item
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="cost"
                  id="cost"
                  min="0"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) => handleChange('cost', e.target.value)}
                  className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Saving...' : productId ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}