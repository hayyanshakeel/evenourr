'use client';

import { Gallery } from '@/components/product/gallery';
import { ProductDescription } from '@/components/product/product-description';
import { RelatedProducts } from '@/components/product/related-products';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Product as ProductType } from '@/lib/definitions';

interface ProductVariant {
  id: number;
  productId: number;
  name: string;
  price: number;
  inventory: number;
  createdAt: string;
  updatedAt: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  images?: { id: number; imageUrl: string; altText: string | null; sortOrder: number }[];
  status: string;
  inventory: number;
  createdAt: string;
  updatedAt: string;
  variants: ProductVariant[];
}

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  if (!product) {
    notFound();
  }

  // Transform the product data to match the expected format for the components
  const transformedProduct: ProductType = {
    id: product.id.toString(),
    handle: product.slug,
    availableForSale: product.status === 'active' && product.inventory > 0,
    title: product.name,
    description: product.description || '',
    descriptionHtml: product.description || '',
    priceRange: {
      maxVariantPrice: {
        amount: (product.price / 100).toString(),
        currencyCode: 'USD'
      },
      minVariantPrice: {
        amount: (product.price / 100).toString(),
        currencyCode: 'USD'
      }
    },
    images: product.images && product.images.length > 0 
      ? product.images.map((img: any) => ({ 
          url: img.imageUrl, 
          altText: img.altText || product.name, 
          width: 600, 
          height: 600 
        }))
      : product.imageUrl 
        ? [{ 
            url: product.imageUrl, 
            altText: product.name, 
            width: 600, 
            height: 600 
          }] 
        : [],
    featuredImage: product.images && product.images.length > 0
      ? { 
          url: product.images[0]?.imageUrl || '', 
          altText: product.images[0]?.altText || product.name, 
          width: 600, 
          height: 600 
        }
      : product.imageUrl 
        ? { 
            url: product.imageUrl, 
            altText: product.name, 
            width: 600, 
            height: 600 
          }
        : { 
            url: '/placeholder.svg', 
            altText: 'Product image', 
            width: 600, 
            height: 600 
          },
    variants: product.variants.map(variant => ({
      id: variant.id.toString(),
      title: variant.name,
      availableForSale: product.status === 'active' && variant.inventory > 0,
      selectedOptions: [{ name: 'Title', value: variant.name }],
      price: {
        amount: (variant.price / 100).toString(),
        currencyCode: 'USD'
      }
    })),
    options: [
      {
        id: 'title',
        name: 'Title',
        values: product.variants.map(v => v.name)
      }
    ],
    seo: {
      title: product.name,
      description: product.description || ''
    },
    tags: [],
    updatedAt: product.updatedAt
  };

  return (
    <div className="mx-auto max-w-screen-2xl px-4">
      <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-black md:p-12 lg:flex-row">
        <div className="h-full w-full basis-full lg:basis-4/6">
          <Gallery images={transformedProduct.images} />
        </div>
        <div className="basis-full lg:basis-2/6">
          <Suspense fallback={<div className="h-[400px] w-full animate-pulse rounded-lg bg-gray-200" />}>
            <ProductDescription product={transformedProduct} />
          </Suspense>
        </div>
      </div>
      
      {/* Related Products Section */}
      <Suspense fallback={<div className="h-[400px] w-full animate-pulse rounded-lg bg-gray-200" />}>
        <RelatedProducts products={[]} />
      </Suspense>
    </div>
  );
}
