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
      try {
        console.log("Attempting to fetch shipping countries...");
        const countries = await getAvailableShippingCountries();
        console.log("--- SHOPIFY API CALL SUCCEEDED ---");
        console.log("Available Countries:", countries);

        setAvailableCountries(countries);
        // ... (rest of the logic is the same)
        const storedCountryCode = localStorage.getItem('selectedCountry') || 'IN';
        const currentCountry = countries.find(c => c.isoCode === storedCountryCode);
        if (currentCountry) {
          setSelectedCountry(currentCountry);
        } else {
          const defaultCountry = countries.find(c => c.isoCode === 'IN');
          setSelectedCountry(defaultCountry || (countries.length > 0 ? countries[0] : null));
          if (localStorage.getItem('selectedCountry')) {
            setShowPopup(true);
          }
        }

      } catch (error) {
        // --- THIS IS THE IMPORTANT DEBUGGING BLOCK ---
        console.error("--- SHOPIFY API CALL FAILED ---");
        console.error("This is the detailed error from the server:");
        // The next line prints the full error object for us to inspect
        console.error(JSON.stringify(error, null, 2)); 
        alert("Error fetching shipping data. Please check the browser's developer console for the detailed error message.");
        
        // Fallback logic to prevent a crash
        const fallbackCountry = { name: 'India', isoCode: 'IN' } as Country;
        setAvailableCountries([fallbackCountry]);
        setSelectedCountry(fallbackCountry);
      } finally {
        setIsLoading(false);
      }
    };

    initShipping();
  }, []);

  // The rest of the component remains the same...
  const productJsonLd = { /* ... */ };

  return (
    <ProductProvider product={product}>
       {/* ... The rest of your JSX ... */}
       <div className="border border-neutral-300 p-4">
            <Link href="/shipping" className="flex w-full items-center justify-between text-left">
                <h3 className="font-bold uppercase">
                    SHIPPING TO{' '}
                    {isLoading ? (
                        '...'
                    ) : selectedCountry?.name ? (
                        <span className="underline decoration-2 underline-offset-4">{selectedCountry.name}</span>
                    ) : (
                        'SELECT COUNTRY'
                    )}
                </h3>
                <ChevronRightIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
            </Link>
            <div className="mt-4 space-y-4 text-sm">
                <div>
                    <div className="flex items-center text-gray-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>Delivery</span>
                        <ChevronRightIcon className="ml-auto h-4 w-4 text-gray-400 flex-shrink-0" />
                    </div>
                    <div className="mt-2 ml-7 rounded-md bg-gray-50 p-3 text-gray-600">
                        <p>Express shipping available</p>
                        <p>Shipping Time: 8 - 12 days</p>
                    </div>
                </div>
                <div className="flex items-center text-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h5V4H4zm0 9h5v5H4v-5zm9-9h5v5h-5V4zm0 9h5v5h-5v-5z" /></svg>
                    <span>Return Policy</span>
                    <ChevronRightIcon className="ml-auto h-4 w-4 text-gray-400 flex-shrink-0" />
                </div>
            </div>
        </div>

        <ProductAccordion descriptionHtml={product.descriptionHtml} />
       {/* ... The rest of your JSX ... */}
    </ProductProvider>
  );
}