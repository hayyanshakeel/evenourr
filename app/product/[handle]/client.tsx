// FILE: app/product/[handle]/client.tsx

'use client';

import { AddToCart } from '@/components/cart/add-to-cart';
import { Gallery } from '@/components/product/gallery';
import { ProductAccordion } from '@/components/product/product-accordion';
import { ProductDescription } from '@/components/product/product-description';
import { ProductProvider } from '@/components/product/product-context';
import { YouMayAlsoLike } from '@/components/product/you-may-also-like';
import { VariantSelector } from '@/components/product/variant-selector';
import { getAvailableShippingCountries } from '@/lib/shopify';
import { Country, Image, Product } from '@/lib/shopify/types';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function ProductPageClient({
  product,
  recommendations
}: {
  product: Product;
  recommendations: Product[];
}) {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initShipping = async () => {
      setIsLoading(true);
      try {
        const countries = await getAvailableShippingCountries();
        const storedCountryCode = localStorage.getItem('selectedCountry') || 'IN';
        const currentCountry = countries.find((c) => c.isoCode === storedCountryCode);
        const defaultCountry = countries.find((c) => c.isoCode === 'IN');
        setSelectedCountry(currentCountry || defaultCountry || null);
      } catch (error) {
        console.error("Failed to fetch shipping countries, defaulting to India.", error);
        setSelectedCountry({ name: 'India', isoCode: 'IN' } as Country);
      } finally {
        setIsLoading(false);
      }
    };

    initShipping();
    window.addEventListener('storage', initShipping);
    return () => window.removeEventListener('storage', initShipping);
  }, []);

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.featuredImage?.url,
    offers: {
      '@type': 'AggregateOffer',
      availability: product.availableForSale ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
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
            <Gallery images={product.images.map((image: Image) => ({ src: image.url, altText: image.altText }))} />
          </div>
          <div className="w-full lg:w-2/5">
            <hr className="border-t-2 border-black" />
            <div className="px-4 pt-6 pb-6 lg:px-12">
              <ProductDescription product={product} />
              <VariantSelector options={product.options} variants={product.variants} />
            </div>
            <hr className="my-6 border-t border-black" />
            <div className="space-y-3 px-4 lg:px-12">
              <div>
                <Link href="/shipping" className="flex items-center justify-between py-2 text-left">
                  <h3 className="font-bold uppercase">
                    SHIPPING TO{' '}
                    {isLoading ? (
                      '...'
                    ) : (
                      <span className="underline decoration-2 underline-offset-4">
                        {selectedCountry?.name || 'INDIA'}
                      </span>
                    )}
                  </h3>
                  <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                </Link>

                <Link href="/policy" className="mt-2 block text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2 1m0 0l-2-1m2 1V2M8 7l2 1M8 7l2-1M8 7v2.5M12 22l-4-4m4 4l4-4M4 12l4-4m-4 4l4 4" /></svg>
                    <span>Delivery</span>
                    {/* FIX: Removed the arrow icon from this line */}
                  </div>
                  <div className="mt-2 ml-7 rounded-md bg-gray-50 p-3">
                    <p>Free shipping on all orders</p>
                    <p>Express Shipping: 3 - 5 business days</p>
                    <p>Standard Shipping: 5 - 7 business days</p>
                  </div>
                </Link>
              </div>

              <ProductAccordion descriptionHtml={product.descriptionHtml} />
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-screen-2xl px-4 pt-8">
          <YouMayAlsoLike products={recommendations} />
        </div>
      </div>
      <div className="fixed bottom-0 left-0 z-20 w-full border-t border-neutral-200 bg-white p-4">
        <div className="mx-auto max-w-2xl">
          <AddToCart product={product} />
        </div>
      </div>
    </ProductProvider>
  );
}