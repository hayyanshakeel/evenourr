// File: app/(admin)/dashboard/products/new/page.tsx

'use client';

import Header from '@/components/admin/header';
import ProductForm from '@/components/admin/forms/product-form';

export default function NewProductPage() {
  return (
    <div>
      <Header title="Add Product" />
      <div className="mt-8">
        {/* This uses the advanced form with image upload that we built */}
        <ProductForm />
      </div>
    </div>
  );
}