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
        
        <div className="pb-28">
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
            <div className="w-full lg:w-2/5 px-4 lg:px-12">
              <div className="pt-4 pb-6">
                {/* UPDATED: Made the separator line thicker */}
                <hr className="mb-4 border-t-2 border-black" />
                
                <ProductDescription product={product} />
                <VariantSelector options={product.options} variants={product.variants} />

                {product.descriptionHtml ? (
                  <div
                    className="prose max-w-none pt-6 text-sm text-gray-700"
                    dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                  />
                ) : null}
              </div>
            </div>
          </div>
          
          <div className="mx-auto max-w-screen-2xl px-4">
            <Suspense>
              <RelatedProducts id={product.id} />
            </Suspense>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 z-20 w-full border-t border-neutral-200 bg-white p-4">
          <div className="mx-auto max-w-2xl">
            <AddToCart product={product} />
          </div>
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