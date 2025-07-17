// app/product/[handle]/page.tsx

import { AddToCart } from '@/components/cart/add-to-cart';
import Footer from '@/components/layout/footer';
import ProductGridItems from '@/components/layout/product-grid-items';
import { Gallery } from '@/components/product/gallery';
import { ProductDescription } from '@/components/product/product-description';
import { ProductProvider } from '@/components/product/product-context';
import { VariantSelector } from '@/components/product/variant-selector';
import { HIDDEN_PRODUCT_TAG } from '@/lib/constants';
import { getProduct, getProductRecommendations } from '@/lib/shopify';
import { Image, Product } from '@/lib/shopify/types';
import { notFound } from 'next/navigation';
import { Fragment, Suspense } from 'react';

// Metadata function remains the same...
export async function generateMetadata({ params: paramsPromise }: { params: { handle: string } }) {
  const params = await paramsPromise;
  const product = await getProduct(params.handle);

  if (!product) {
    notFound();
  }

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable
      }
    },
    openGraph: url
      ? {
          images: [
            {
              url,
              width,
              height,
              alt
            }
          ]
        }
      : null
  };
}


export default async function ProductPage({ params: paramsPromise }: { params: { handle:string } }) {
  const params = await paramsPromise;
  const product = await getProduct(params.handle);

  if (!product) {
    notFound();
  }

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
      <Fragment>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productJsonLd)
          }}
        />
        {/* Add padding-bottom to prevent content from being hidden by the sticky button */}
        <div className="pb-24">
          <div className="mx-auto max-w-screen-2xl px-4">
            <div className="flex flex-col lg:flex-row">
              {/* Gallery */}
              <div className="w-full lg:w-3/5">
                <Gallery
                  images={product.images.map((image: Image) => ({
                    src: image.url,
                    altText: image.altText
                  }))}
                />
              </div>

              {/* Product Info, Variants, and Description */}
              <div className="w-full lg:w-2/5 lg:px-12">
                <div className="py-6">
                  {/* Title and Price */}
                  <ProductDescription product={product} />
                  
                  {/* Color and Size Selectors */}
                  <VariantSelector options={product.options} variants={product.variants} />

                  {/* Product Description Text (Moved Here) */}
                  {product.descriptionHtml ? (
                    <div
                      className="prose max-w-none pt-6 text-sm text-gray-700"
                      dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Add to Bag Button */}
        <div className="fixed bottom-0 left-0 z-10 w-full border-t bg-white p-4">
          <div className="mx-auto max-w-screen-2xl px-4">
            <AddToCart product={product} />
          </div>
        </div>

        <div className="mx-auto max-w-screen-2xl px-4">
          <Suspense>
            <RelatedProducts id={product.id} />
          </Suspense>
        </div>
        <Suspense>
          <Footer />
        </Suspense>
      </Fragment>
    </ProductProvider>
  );
}

async function RelatedProducts({ id }: { id: string }) {
  const relatedProducts = await getProductRecommendations(id);

  if (!relatedProducts.length) return null;

  return (
    <div className="py-8">
      <h2 className="mb-4 text-2xl font-bold">Related Products</h2>
      <ProductGridItems products={relatedProducts} />
    </div>
  );
}