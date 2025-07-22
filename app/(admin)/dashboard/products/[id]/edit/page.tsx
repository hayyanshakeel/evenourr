'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/admin/header';
import ProductForm from '@/components/admin/forms/product-form';

export default function EditProductPage() {
  const params = useParams();
  const productId = parseInt(params.id as string);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Header title="Edit Product" />
        <div className="mt-8 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <Header title="Edit Product" />
        <div className="mt-8 text-center text-gray-500">Product not found</div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Edit Product" />
      <div className="mt-8">
        <ProductForm initialData={product} productId={productId} />
      </div>
    </div>
  );
}
