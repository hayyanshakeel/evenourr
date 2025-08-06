'use client';

import { useRouter } from 'next/navigation';
import { FormLayout } from '@/components/admin/form-layout';
import SimpleProductForm from '@/components/admin/forms/simple-product-form';

export default function NewProductPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/hatsadmin/dashboard/products');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Add product</h1>
          <p className="text-gray-600 mt-1">Create a new product for your store</p>
        </div>
        <SimpleProductForm />
      </div>
    </div>
  );
}
