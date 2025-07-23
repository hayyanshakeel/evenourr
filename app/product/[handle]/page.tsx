import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import React from 'react';

import { db } from '@/lib/db';
import { products as productsTable } from '@/lib/db/schema';
import { eq, ne } from 'drizzle-orm';
import { desc } from 'drizzle-orm';

import { GridTileImage } from '@/components/grid/tile';
import Footer from '@/components/layout/footer';
import Link from 'next/link';
import { ProductPageClient } from '@/components/product/product-page-client';
import { Product } from '@/lib/definitions';

export async function generateMetadata({
  params
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const handle = params?.handle;
  if (!handle) return notFound();
  const product = await db.query.products.findFirst({ where: eq(productsTable.slug, handle) });
  if (!product) return notFound();
  return { title: product.name, description: product.description };
}

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const handle = params?.handle;
  if (!handle) return notFound();

  const productData = await db.query.products.findFirst({
    where: eq(productsTable.slug, handle),
    with: {
      variants: true,
      options: true
    }
  });

  if (!productData) return notFound();

  const getOptionValues = (optionName: string) => {
    const values = new Set<string>();
    productData.variants.forEach((variant) => {
      const variantOptions = variant.title.split(' / ');
      const optionIndex = productData.options.findIndex((opt) => opt.name === optionName);
      if (optionIndex !== -1 && variantOptions[optionIndex]) {
        values.add(variantOptions[optionIndex]);
      }
    });
    return Array.from(values);
  };

  const formattedProduct: Product = {
    id: productData.id.toString(),
    handle: productData.slug,
    availableForSale: productData.status === 'active',
    title: productData.name || '',
    description: productData.description || '',
    descriptionHtml: `<p>${productData.description || ''}</p>`,
    options: productData.options.map((option) => ({
      id: option.id.toString(),
      name: option.name,
      values: getOptionValues(option.name)
    })),
    priceRange: {
      maxVariantPrice: { amount: (productData.price / 100).toString(), currencyCode: 'USD' },
      minVariantPrice: { amount: (productData.price / 100).toString(), currencyCode: 'USD' }
    },
    variants: productData.variants.map((variant) => ({
      id: variant.id.toString(),
      title: variant.title,
      availableForSale: (variant.inventory ?? 0) > 0,
      selectedOptions: variant.title.split(' / ').map((value, index) => ({
        name: productData.options[index]?.name || '',
        value: value.trim()
      })),
      price: { amount: (variant.price / 100).toString(), currencyCode: 'USD' }
    })),
    featuredImage: {
      url: productData.imageUrl || '',
      altText: productData.name || '',
      width: 1000,
      height: 1000
    },
    images: [{ url: productData.imageUrl || '', altText: productData.name || '', width: 1000, height: 1000 }],
    seo: { title: productData.name || '', description: productData.description || '' },
    tags: [],
    // This is the line that fixes the error
    updatedAt: productData.updatedAt || productData.createdAt
  };

  return (
    <>
      <div className="mx-auto max-w-screen-2xl px-4">
        <ProductPageClient product={formattedProduct} />
        <Suspense>
          <RelatedProducts id={productData.id} />
        </Suspense>
      </div>
      <Suspense>
        <Footer />
      </Suspense>
    </>
  );
}

async function RelatedProducts({ id }: { id: number }) {
  const relatedProducts = await db
    .select()
    .from(productsTable)
    .where(ne(productsTable.id, id))
    .orderBy(desc(productsTable.createdAt))
    .limit(4);

  if (!relatedProducts.length) return null;

  const formattedRelatedProducts = relatedProducts.map((product) => ({
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
          <li
            key={product.handle}
            className="aspect-square w-full flex-none min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
          >
            <Link className="relative h-full w-full" href={`/product/${product.handle}`}>
              <GridTileImage
                alt={product.title as string}
                label={{
                  title: product.title as string,
                  amount: product.priceRange.maxVariantPrice.amount,
                  currencyCode: product.priceRange.maxVariantPrice.currencyCode
                }}
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