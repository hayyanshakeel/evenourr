'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/admin/header';
import SimpleProductForm from '@/components/admin/forms/simple-product-form';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export default function EditProductPage() {
  const params = useParams();
  const { makeAuthenticatedRequest, isReady, isAuthenticated } = useAdminAuth();
  const productId = parseInt(params.id as string);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (isNaN(productId)) return;
      try {
        const response = await makeAuthenticatedRequest(`/api/admin/products/${productId}`);
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
    if (isReady && isAuthenticated && !fetchedRef.current) {
      fetchedRef.current = true;
      fetchProduct();
    }
  }, [productId, isReady, isAuthenticated]);

  if (loading) {
    return (
      <div>
        <Header title="Edit Product" />
        <div className="mt-8 text-center">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <Header title="Edit Product" />
        <div className="mt-8 text-center text-gray-500">Product not found.</div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Edit Product" />
      <div className="mt-8">
        <SimpleProductForm initialData={product} />
      </div>
    </div>
  );
}