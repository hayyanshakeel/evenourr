'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/solid';

// Make sure to add these to your .env.local file
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

interface ProductFormProps {
  initialData?: any;
  productId?: number;
}

export default function ProductForm({ initialData, productId }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // --- Main State Management ---
  const [product, setProduct] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    status: initialData?.status || 'active',
    imageUrl: initialData?.imageUrl || null
  });

  const [options, setOptions] = useState(initialData?.options || []);
  const [variants, setVariants] = useState(initialData?.variants || []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      const file = acceptedFiles[0];
      setImageFile(file);
      setProduct((p) => ({ ...p, imageUrl: URL.createObjectURL(file) }));
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  // --- Variant Generation Logic ---
  useEffect(() => {
    if (options.length === 0) {
      if (variants.length === 0 || variants.some((v: any) => v.title !== 'Default Title')) {
        setVariants([{ title: 'Default Title', price: '0.00', inventory: '0', sku: '' }]);
      }
      return;
    }

    const generateCombinations = (opts: any[]): string[][] => {
      if (opts.length === 0) return [[]];
      const first = opts[0];
      const rest = opts.slice(1);
      const combs = generateCombinations(rest);
      return first.values.flatMap((v: string) => combs.map((c: string[]) => [v, ...c]));
    };

    const combinations = generateCombinations(options.filter((o: any) => o.values.length > 0));
    const newVariants = combinations.map((combo: string[]) => {
      const title = combo.join(' / ');
      const existingVariant = variants.find((v: any) => v.title === title);
      return {
        title,
        price: existingVariant?.price || '0.00',
        inventory: existingVariant?.inventory || '0',
        sku: existingVariant?.sku || ''
      };
    });

    setVariants(newVariants);
  }, [options, variants]);

  const handleProductChange = (field: keyof typeof product, value: string) => {
    setProduct((p) => ({ ...p, [field]: value }));
    if (field === 'name' && !productId) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setProduct((p) => ({ ...p, slug }));
    }
  };

  // --- Option Handlers ---
  const addOption = () => setOptions([...options, { name: '', values: [] }]);
  const removeOption = (index: number) => setOptions(options.filter((_: any, i: number) => i !== index));
  const updateOptionName = (index: number, name: string) => {
    const newOptions = [...options];
    newOptions[index].name = name;
    setOptions(newOptions);
  };
  const updateOptionValues = (index: number, values: string[]) => {
    const newOptions = [...options];
    newOptions[index].values = values;
    setOptions(newOptions);
  };

  // --- Variant Handlers ---
  const handleVariantChange = (index: number, field: string, value: string) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let uploadedImageUrl = product.imageUrl;
    if (imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('upload_preset', UPLOAD_PRESET!);
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
      });
      if (!response.ok) {
        alert('Image upload failed.');
        setLoading(false);
        return;
      }
      const data = await response.json();
      uploadedImageUrl = data.secure_url;
    }

    try {
      const payload = {
        product: { ...product, imageUrl: uploadedImageUrl },
        options,
        variants
      };

      const url = productId ? `/api/products/${productId}` : '/api/products';
      const method = productId ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        router.push('/dashboard/products');
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to save product');
      }
    } catch (error) {
      alert('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="col-span-2 space-y-8">
          {/* Basic Info */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <input
              type="text"
              placeholder="Product Title"
              value={product.name}
              onChange={(e) => handleProductChange('name', e.target.value)}
              className="w-full border-none text-xl font-medium focus:ring-0"
            />
            <hr className="my-4" />
            <textarea
              placeholder="Description"
              rows={5}
              value={product.description}
              onChange={(e) => handleProductChange('description', e.target.value)}
              className="w-full border-none focus:ring-0"
            />
          </div>

          {/* Media */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-medium">Media</h3>
            <div
              {...getRootProps()}
              className="mt-4 flex cursor-pointer justify-center rounded-md border-2 border-dashed border-gray-300 px-6 py-10"
            >
              <div className="text-center">
                {product.imageUrl ? (
                  <Image src={product.imageUrl} alt="Preview" width={100} height={100} className="mx-auto" />
                ) : (
                  <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
                )}
                <p className="mt-2 text-sm text-gray-600">
                  Drag & drop or <span className="text-blue-600">click to upload</span>
                </p>
                <input {...getInputProps()} className="hidden" />
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-medium">Variants</h3>
            {options.map((opt: any, index: number) => (
              <div key={index} className="mt-4 rounded border p-4">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Option name</label>
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="text-sm text-red-600"
                  >
                    Remove
                  </button>
                </div>
                <input
                  type="text"
                  value={opt.name}
                  onChange={(e) => updateOptionName(index, e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
                <label className="mt-2 block text-sm font-medium">Option values</label>
                <input
                  type="text"
                  placeholder="Comma-separated values, e.g., Red, Blue"
                  value={opt.values.join(', ')}
                  onChange={(e) => updateOptionValues(index, e.target.value.split(',').map((s) => s.trim()))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addOption}
              className="mt-4 text-sm font-medium text-blue-600"
            >
              + Add another option
            </button>
            <hr className="my-4" />
            {variants.length > 0 && (
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="py-2 text-left text-xs font-medium uppercase text-gray-500">
                      Variant
                    </th>
                    <th className="py-2 text-left text-xs font-medium uppercase text-gray-500">
                      Price
                    </th>
                    <th className="py-2 text-left text-xs font-medium uppercase text-gray-500">
                      Available
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map((variant: any, index: number) => (
                    <tr key={index}>
                      <td className="py-2 pr-2">{variant.title}</td>
                      <td className="py-2 px-2">
                        <input
                          type="text"
                          value={variant.price}
                          onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                          className="w-full rounded border-gray-300"
                        />
                      </td>
                      <td className="py-2 pl-2">
                        <input
                          type="text"
                          value={variant.inventory}
                          onChange={(e) => handleVariantChange(index, 'inventory', e.target.value)}
                          className="w-full rounded border-gray-300"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-1 space-y-8">
          {/* Status */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-medium">Status</h3>
            <select
              value={product.status}
              onChange={(e) => handleProductChange('status', e.target.value)}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-end gap-4">
        <button
          type="button"
          className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium"
          onClick={() => router.back()}
        >
          Discard
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}