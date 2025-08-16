'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FormLayout } from '@/components/admin/form-layout';
import SimpleProductForm from '@/components/admin/forms/simple-product-form';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
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
      <FormLayout
        title="Edit Product"
        subtitle="Update product information, pricing, and inventory"
        onBack={() => router.push('/hatsadmin/dashboard/products')}
      >
        <div className="space-y-6">
          {/* Loading Skeleton */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card className="admin-card">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                </CardContent>
              </Card>
              <Card className="admin-card">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card className="admin-card">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </FormLayout>
    );
  }

  if (!product) {
    return (
      <FormLayout
        title="Edit Product"
        subtitle="Product not found"
        onBack={() => router.push('/hatsadmin/dashboard/products')}
      >
        <Card className="admin-card">
          <CardContent className="p-8 text-center">
            <div className="text-gray-500">
              <h3 className="text-lg font-medium mb-2">Product Not Found</h3>
              <p>The product you're looking for doesn't exist or has been removed.</p>
            </div>
          </CardContent>
        </Card>
      </FormLayout>
    );
  }

  return (
    <FormLayout
      title="Edit Product"
      subtitle="Update product information, pricing, and inventory"
      onBack={() => router.push('/hatsadmin/dashboard/products')}
    >
      <SimpleProductForm initialData={product} />
    </FormLayout>
  );
}