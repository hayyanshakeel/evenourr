// app/product/[handle]/client.tsx

'use client';

import { AddToCart } from '@/components/cart/add-to-cart';
import ProductGridItems from '@/components/layout/product-grid-items';
import { Gallery } from '@/components/product/gallery';
import { ProductAccordion } from '@/components/product/product-accordion';
import { ProductDescription } from '@/components/product/product-description';
import { ProductProvider } from '@/components/product/product-context';
import { VariantSelector } from '@/components/product/variant-selector';
import { Image, Product } from '@/lib/shopify/types';

export function ProductPageClient({
  product,
  recommendations
}: {
  product: Product;
  recommendations: Product[];
}) {
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.featuredImage?.url,
    offers: {
      '@type': 'AggregateOffer',
      availability: product.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      highPrice: product.priceRange.maxVariantPrice.amount,
      lowPrice: product.priceRange.minVariantPrice.amount
    }
  };

  return (
    <ProductProvider product={product}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <div className="pb-28">
        <div className="lg:flex">
          <div className="w-full lg:w-3/5">
            <Gallery
              images={product.images.map((image: Image) => ({
                src: image.url,
                altText: image.altText
              }))}
            />
          </div>
          <div className="w-full lg:w-2/5">
            <hr className="border-t-2 border-black" />
            <div className="px-4 pt-6 pb-6 lg:px-12">
              <ProductDescription product={product} />
              <VariantSelector options={product.options} variants={product.variants} />
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-screen-2xl px-4 pt-8">
          <ProductAccordion descriptionHtml={product.descriptionHtml} />
        </div>

        {recommendations.length > 0 && (
          <div className="mx-auto max-w-screen-2xl px-4 pt-8">
            <div className="py-8">
              <h2 className="mb-4 text-2xl font-bold">Related Products</h2>
              <ProductGridItems products={recommendations} />
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 z-20 w-full border-t border-neutral-200 bg-white p-4">
        <div className="mx-auto max-w-2xl">
          <AddToCart product={product} />
        </div>
      </div>
      
      {/* FIX: The Footer is no longer rendered here. It is handled by the root layout. */}
    </ProductProvider>
  );
}
