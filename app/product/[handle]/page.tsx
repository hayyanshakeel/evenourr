import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/shopify';
import { ProductDetails } from '@/components/layout/product/product-details';
import type { Metadata } from 'next';

interface PageProps {
  params: {
    handle: string;
  };
}

export default async function ProductPage({ params }: PageProps) {
  const product = await getProduct(params.handle);

  if (!product) {
    notFound();
  }

  return (
    <section className="pt-8">
      <ProductDetails product={product} />
    </section>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProduct(params.handle);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.featuredImage ? [{ url: product.featuredImage.url }] : [],
    },
  };
}
