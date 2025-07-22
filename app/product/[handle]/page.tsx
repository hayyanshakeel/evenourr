// app/product/[handle]/page.tsx

import { notFound } from 'next/navigation';
import { Gallery } from 'components/product/gallery';
import { ProductDescription } from 'components/product/product-description';
// Corrected import path below
import { RelatedProducts } from 'components/product/related-products';
import { getProductByHandle, getRelatedProducts } from '@/lib/data';
import { Product, ProductImage } from '@/lib/definitions';

export const runtime = 'nodejs';
export const revalidate = 60;

export async function generateMetadata({ params }: { params: { handle: string } }) {
  const product = await getProductByHandle(params.handle);

  if (!product) return notFound();

  return {
    title: product.name,
    description: product.description
  };
}

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const productData = await getProductByHandle(params.handle);

  if (!productData) {
    return notFound();
  }

  const product: Product = {
    ...productData,
    images: (productData as any).images || [],
    variants: (productData as any).variants || []
  };

  const relatedProducts = await getRelatedProducts(product.id);

  return (
    <>
      <div className="mx-auto max-w-screen-2xl px-4 py-12">
        <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 lg:flex-row lg:gap-8">
          <div className="h-full w-full basis-full lg:basis-3/5">
            <Gallery
              images={
                product.images?.map((image: ProductImage) => ({
                  src: image.url,
                  altText: image.altText
                })) || []
              }
            />
          </div>
          <div className="basis-full lg:basis-2/5">
            <ProductDescription product={product} />
          </div>
        </div>
        {relatedProducts.length > 0 && (
          <div className="py-8">
            <h2 className="mb-4 text-2xl font-bold">Related Products</h2>
            <RelatedProducts products={relatedProducts as Product[]} />
          </div>
        )}
      </div>
    </>
  );
}