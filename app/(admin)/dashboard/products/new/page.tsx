import Header from '@/components/admin/header';
import ProductForm from '@/components/admin/forms/product-form';

export default function NewProductPage() {
  return (
    <div>
      {/* The Header is now part of the layout, so we don't need it here. */}
      {/* The title will be set automatically by the layout. */}
      <div className="mt-8">
        <ProductForm />
      </div>
    </div>
  );
}