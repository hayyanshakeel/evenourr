import Header from '@/components/admin/header';
import ProductForm from '@/components/admin/forms/product-form';

export default function NewProductPage() {
  return (
    <div>
      <Header title="Add Product" />
      <div className="mt-8">
        <ProductForm />
      </div>
    </div>
  );
}
