import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { db } from '@/lib/turso';
import { products } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { Gallery } from 'components/product/gallery';
import { ProductProvider } from 'components/product/product-context';
import { ProductDescription } from 'components/product/product-description';
import Footer from 'components/layout/footer';

export async function generateMetadata({ params }: { params: { handle: string } }): Promise<Metadata> {
  const product = await db.select().from(products).where(eq(products.handle, params.handle)).get();

  if (!product) return notFound();

  return {
    title: product.seoTitle || product.title,
    description: product.seoDescription || product.description,
  };
}

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await db.select().from(products).where(eq(products.handle, params.handle)).get();

  if (!product) return notFound();

  // For now, we'll use a simplified product structure.
  // You can expand this to include variants and options later.
  const productForPage = {
      ...product,
      images: product.imageUrl ? [{ src: product.imageUrl, altText: product.title }] : [],
      priceRange: {
          maxVariantPrice: {
              amount: product.price,
              currencyCode: 'USD'
          }
      },
      options: [], // Add logic to fetch and format options if you have variants
      variants: [], // Add logic to fetch and format variants
      descriptionHtml: product.description || ""
  }

  return (
    <ProductProvider>
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4">
        <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 lg:flex-row lg:gap-8 dark:border-neutral-800 dark:bg-black">
          <div className="h-full w-full basis-full lg:basis-4/6">
            <Gallery
              images={productForPage.images}
            />
          </div>

          <div className="basis-full lg:basis-2/6">
            <ProductDescription product={productForPage as any} />
          </div>
        </div>
      </div>
      <Footer />
    </ProductProvider>
  );
}