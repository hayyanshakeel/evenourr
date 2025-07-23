// File: app/product/[handle]/page.tsx

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import React from 'react'; // Added to help with JSX type resolution

import { db } from '@/lib/db';
import { products as productsTable } from '@/lib/db/schema';
import { eq, desc, ne } from 'drizzle-orm';

import { GridTileImage } from '@/components/grid/tile';
import Footer from '@/components/layout/footer';
import Link from 'next/link';
import { ProductPageClient } from '@/components/product/product-page-client';
import { Product } from '@/lib/definitions';

export async function generateMetadata({ params }: { params: { handle: string } }): Promise<Metadata> {
  const handle = params?.handle;
  if (!handle) return notFound();
  const product = await db.query.products.findFirst({ where: eq(productsTable.slug, handle) });
  if (!product) return notFound();
  return { title: product.name, description: product.description };
}

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const handle = params?.handle;
  if (!handle) return notFound();
  const product = await db.query.products.findFirst({ where: eq(productsTable.slug, handle) });
  if (!product) return notFound();

  const formattedProduct: Product = {
    id: product.id.toString(),
    handle: product.slug,
    availableForSale: product.status === 'active',
    title: product.name || '',
    description: product.description || '',
    descriptionHtml: `<p>${product.description || ''}</p>`,
    options: [],
    priceRange: {
      maxVariantPrice: { amount: (product.price / 100).toString(), currencyCode: 'USD' },
      minVariantPrice: { amount: (product.price / 100).toString(), currencyCode: 'USD' }
    },
    variants: [],
    featuredImage: { url: product.imageUrl || '', altText: product.name || '', width: 1000, height: 1000 },
    images: [{ url: product.imageUrl || '', altText: product.name || '', width: 1000, height: 1000 }],
    seo: { title: product.name || '', description: product.description || '' },
    tags: [],
    updatedAt: product.updatedAt
  };

  return (
    <>
      <div className="mx-auto max-w-screen-2xl px-4">
        <ProductPageClient product={formattedProduct} />
        <Suspense>
          <RelatedProducts id={product.id} />
        </Suspense>
      </div>
      <Suspense>
        <Footer />
      </Suspense>
    </>
  );
}

async function RelatedProducts({ id }: { id: number }) {
  const relatedProducts = await db.select().from(productsTable).where(ne(productsTable.id, id)).orderBy(desc(productsTable.createdAt)).limit(4);
  if (!relatedProducts.length) return null;
  const formattedRelatedProducts = relatedProducts.map((product: any) => ({
    handle: product.slug,
    title: product.name,
    priceRange: { maxVariantPrice: { amount: (product.price / 100).toString(), currencyCode: 'USD' } },
    featuredImage: { url: product.imageUrl }
  }));
  return (
    <div className="py-8">
      <h2 className="mb-4 text-2xl font-bold">Related Products</h2>
      <ul className="flex w-full gap-4 overflow-x-auto pt-1">
        {formattedRelatedProducts.map((product: any) => (
          <li key={product.handle} className="aspect-square w-full flex-none min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5">
            <Link className="relative h-full w-full" href={`/product/${product.handle}`}>
              <GridTileImage
                alt={product.title as string}
                label={{ title: product.title as string, amount: product.priceRange.maxVariantPrice.amount, currencyCode: product.priceRange.maxVariantPrice.currencyCode }}
                src={product.featuredImage.url!}
                fill
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}