// app/(admin)/dashboard/products/new/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/admin/header';

type Variant = {
  title: string;
  price: string;
  inventory: string;
  sku: string;
};

const NewProductPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [status, setStatus] = useState('active');
  const [variants, setVariants] = useState<Variant[]>([{ title: 'Default Title', price: '', inventory: '', sku: '' }]);

  const handleVariantChange = (index: number, field: keyof Variant, value: string) => {
    const newVariants = [...variants];
    const variantToUpdate = newVariants[index];

    // This check fixes the "Object is possibly 'undefined'" error
    if (variantToUpdate) {
      variantToUpdate[field] = value;
      setVariants(newVariants);
    }
  };

  const addVariant = () => {
    setVariants([...variants, { title: '', price: '', inventory: '', sku: '' }]);
  };

  const removeVariant = (index: number) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    const payload = {
      name,
      slug,
      description,
      price: Math.round(parseFloat(price || '0') * 100),
      status,
      variants: variants.map(v => ({
        ...v,
        price: Math.round(parseFloat(v.price || '0') * 100),
        inventory: parseInt(v.inventory || '0', 10),
      })),
    };

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to create product');
      
      router.push('/dashboard/products');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header title="Add Product" />
      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        {/* Form sections remain the same */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <input type="text" placeholder="Product name" required value={name} onChange={(e) => setName(e.target.value)} className="w-full text-xl font-semibold border-b pb-2 focus:outline-none focus:border-blue-500"/>
          <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className="mt-4 w-full rounded-md border-gray-300 shadow-sm"/>
        </div>
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">Pricing & Variants</h3>
          {variants.map((variant, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 border-t py-4">
              <input type="text" placeholder="Title (e.g., Small)" value={variant.title} onChange={(e) => handleVariantChange(index, 'title', e.target.value)} className="col-span-3 rounded-md border-gray-300"/>
              <input type="number" placeholder="Price" value={variant.price} onChange={(e) => handleVariantChange(index, 'price', e.target.value)} step="0.01" className="col-span-3 rounded-md border-gray-300"/>
              <input type="number" placeholder="Inventory" value={variant.inventory} onChange={(e) => handleVariantChange(index, 'inventory', e.target.value)} className="col-span-2 rounded-md border-gray-300"/>
              <input type="text" placeholder="SKU" value={variant.sku} onChange={(e) => handleVariantChange(index, 'sku', e.target.value)} className="col-span-3 rounded-md border-gray-300"/>
              {variants.length > 1 && <button type="button" onClick={() => removeVariant(index)} className="col-span-1 text-red-500">Remove</button>}
            </div>
          ))}
          <button type="button" onClick={addVariant} className="mt-4 text-sm font-medium text-blue-600">+ Add another variant</button>
        </div>
        <div className="flex justify-end gap-4 border-t pt-6">
            <button type="submit" disabled={loading} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white">Save Product</button>
        </div>
      </form>
    </div>
  );
};

export default NewProductPage;