// app/product/[handle]/client.tsx

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

// This component receives all the data fetched on the server
export function ProductPageClient({
  product,
  recommendations
}: {
  product: Product;
  recommendations: Product[];
}) {
  const [availableCountries, setAvailableCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initShipping = async () => {
      setIsLoading(true);
      const countries = await getAvailableShippingCountries();
      setAvailableCountries(countries);

      const storedCountryCode = localStorage.getItem('selectedCountry') || 'IN';
      const currentCountry = countries.find(c => c.isoCode === storedCountryCode);

      if (currentCountry) {
        setSelectedCountry(currentCountry);
      } else {
        const defaultCountry = countries.find(c => c.isoCode === 'IN');
        setSelectedCountry(defaultCountry || countries[0] || null);
        if (localStorage.getItem('selectedCountry')) {
          setShowPopup(true);
        }
      }
      setIsLoading(false);
    };

    initShipping();
    const handleStorageChange = () => initShipping();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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
      
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center w-full max-w-sm">
            <h3 className="text-xl font-bold mb-3">Sorry!</h3>
            <p className="text-neutral-600 mb-4">We don't deliver to this location yet.</p>
            <Link href="/shipping" className="text-blue-600 font-semibold underline block w-full py-2">
              Change your country
            </Link>
            <button onClick={() => setShowPopup(false)} className="block w-full bg-gray-800 text-white mt-2 py-2 rounded-md font-semibold">
              OK
            </button>
          </div>
        </div>
      )}

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

            <hr className="my-6 border-t border-black" />

            <div className="space-y-3 px-4 lg:px-12">
              {/* This is the new, corrected link to the shipping page */}
              <div className="border border-neutral-300">
                <div className="p-4">
                  <Link href="/shipping" className="flex w-full items-center justify-between text-left">
                    <span className="font-semibold uppercase">
                      {isLoading ? 'Loading Shipping...' : `SHIPPING TO ${selectedCountry?.name || 'SELECT COUNTRY'}`}
                    </span>
                    <ChevronRightIcon className="h-5 w-5 text-gray-500" />
                  </Link>
                </div>
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