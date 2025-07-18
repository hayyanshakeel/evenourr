// FILE: app/product/[handle]/client.tsx

'use client';

import { AddToCart } from '@/components/cart/add-to-cart';
import { Gallery } from '@/components/product/gallery';
import { ProductDescription as ProductDescriptionHeader } from '@/components/product/product-description';
import { ProductProvider } from '@/components/product/product-context';
import { YouMayAlsoLike } from '@/components/product/you-may-also-like';
import { VariantSelector } from '@/components/product/variant-selector';
import { SlideUpPanel } from '@/components/product/slide-up-panel';
import { QuickView } from '@/components/product/quick-view';
import Prose from '@/components/prose';
import { getAvailableShippingCountries } from '@/lib/shopify';
import { Country, Image, Product, ProductVariant } from '@/lib/shopify/types';
import { createUrl } from '@/lib/utils';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

function parseDescription(html: string, product: Product): { description: string; sizeFit: string } {
  const defaultSizeFit = 'This item fits true to size. Order your normal size.';
  const defaultDescription = product.description || '<p>No description available for this product.</p>';

  const sizeFitSeparatorRegex = /<h[1-6][^>]*>.*Size.*&.*Fit.*<\/h[1-6]>/i;
  const match = html.match(sizeFitSeparatorRegex);

  if (match && typeof match.index === 'number') {
    const descriptionContent = html.substring(0, match.index).trim();
    const sizeFitContent = html.substring(match.index).trim();
    
    return {
      description: descriptionContent || defaultDescription,
      sizeFit: sizeFitContent || defaultSizeFit
    };
  }

  return { description: html || defaultDescription, sizeFit: defaultSizeFit };
}

type Combination = {
  id: string;
  availableForSale: boolean;
  [key: string]: string | boolean;
};

export function ProductPageClient({
  product,
  recommendations
}: {
  product: Product;
  recommendations: Product[];
}) {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isSizeFitOpen, setIsSizeFitOpen] = useState(false);
  const [isCareOpen, setIsCareOpen] = useState(false);
  const [isSizeSelectorOpen, setIsSizeSelectorOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  
  const { description, sizeFit } = parseDescription(product.descriptionHtml, product);
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sizeOption = product.options.find(option => option.name.toLowerCase() === 'size');
  const selectedSize = searchParams.get('size');
  
  const combinations: Combination[] = product.variants.map((variant: ProductVariant) => ({
    id: variant.id,
    availableForSale: variant.availableForSale,
    ...variant.selectedOptions.reduce(
      (accumulator: { [key: string]: string }, option: { name: string; value: string }) => ({
        ...accumulator,
        [option.name.toLowerCase()]: option.value
      }),
      {}
    )
  }));

  const handleSizeClick = (value: string) => {
    const optionSearchParams = new URLSearchParams(searchParams.toString());
    optionSearchParams.set('size', value);
    router.replace(createUrl(pathname, optionSearchParams), { scroll: false });
    setIsSizeSelectorOpen(false);
  };

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

  const productJsonLd = { /* ... */ };

  return (
    <ProductProvider product={product}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <div className="pb-28">
        <div className="lg:flex">
          <div className="w-full lg:w-3/5">
            <Gallery images={product.images.map((image: Image) => ({ src: image.url, altText: image.altText }))} />
          </div>
          <div className="w-full lg:w-2/5">
            <hr className="border-t-2 border-black" />
            <div className="px-4 pt-6 pb-4 lg:px-12">
              <ProductDescriptionHeader product={product} />
              <VariantSelector 
                options={product.options} 
                variants={product.variants} 
                onOpenSizeSelector={() => setIsSizeSelectorOpen(true)}
              />
            </div>
            <hr className="my-6 border-t border-black" />
            <div className="space-y-2 px-4 lg:px-12">
              <div>
                <Link href="/shipping" className="flex items-center justify-between py-2 text-left">
                  <h3 className="font-bold uppercase">SHIPPING TO{' '}{isLoading ? ('...') : (<span className="underline decoration-2 underline-offset-4">{selectedCountry?.name || 'INDIA'}</span>)}</h3>
                </Link>
                <Link href="/policy" className="mt-2 block text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2 1m0 0l-2-1m2 1V2M8 7l2 1M8 7l2-1M8 7v2.5M12 22l-4-4m4 4l4-4M4 12l4-4m-4 4l4 4" /></svg>
                    <span>Delivery</span>
                    <ChevronRightIcon className="ml-auto h-4 w-4" />
                  </div>
                  <div className="mt-2 ml-7 rounded-md bg-gray-50 p-3">
                    <p>Free shipping on all orders</p>
                    <p>Express Shipping: 3 - 5 business days</p>
                    <p>Standard Shipping: 5 - 7 business days</p>
                  </div>
                </Link>
              </div>
              <div className="border-t pt-4">
                <button onClick={() => setIsDescriptionOpen(true)} className="flex w-full items-center justify-between py-2 text-left font-bold uppercase"><span>Product Description</span><ChevronRightIcon className="h-5 w-5" /></button>
                <button onClick={() => setIsSizeFitOpen(true)} className="flex w-full items-center justify-between py-2 text-left font-bold uppercase"><span>Size & Fit</span><ChevronRightIcon className="h-5 w-5" /></button>
                <button onClick={() => setIsCareOpen(true)} className="flex w-full items-center justify-between py-2 text-left font-bold uppercase"><span>Handle & Wash Care</span><ChevronRightIcon className="h-5 w-5" /></button>
              </div>
            </div>
          </div>
        </div>
        <hr className="my-8 border-black" />
        <div className="mx-auto max-w-screen-2xl px-4">
          <YouMayAlsoLike products={recommendations} onQuickView={setQuickViewProduct} />
        </div>
      </div>
      <div className="fixed bottom-0 left-0 z-20 w-full border-t border-neutral-200 bg-white p-4">
        <div className="mx-auto max-w-2xl">
          <AddToCart product={product} />
        </div>
      </div>
      <SlideUpPanel isOpen={isDescriptionOpen} onClose={() => setIsDescriptionOpen(false)} title="Product Description" panelClassName="h-auto max-h-[85vh]"><Prose html={description} /></SlideUpPanel>
      <SlideUpPanel isOpen={isSizeFitOpen} onClose={() => setIsSizeFitOpen(false)} title="Size & Fit" panelClassName="h-auto max-h-[85vh]"><Prose html={sizeFit} /></SlideUpPanel>
      <SlideUpPanel isOpen={isCareOpen} onClose={() => setIsCareOpen(false)} title="Handle & Wash Care" panelClassName="h-auto max-h-[85vh]"><Prose html={`<ul><li>Machine wash cold with like colors</li><li>Do not bleach</li><li>Tumble dry low</li><li>Iron on low heat if needed</li><li>Do not dry clean</li></ul>`} /></SlideUpPanel>
      <SlideUpPanel isOpen={isSizeSelectorOpen} onClose={() => setIsSizeSelectorOpen(false)} title="SELECT SIZE" panelClassName="h-auto max-h-[45vh]">
          <div className="flex w-full items-center justify-between">
              <span className="font-semibold">SIZE</span>
              <a href="#" className="flex items-center gap-1 text-sm font-semibold uppercase">Size Guide<ChevronRightIcon className="h-4 w-4" /></a>
          </div>
          <div className="mt-4"><button className="rounded-full bg-gray-100 px-4 py-1 text-sm text-black">Evenour Size</button></div>
          <div className="mt-6 grid grid-cols-4 gap-4">
            {sizeOption?.values.map((value) => {
               const isAvailable = combinations.some((combination) => combination['size'] === value && combination.availableForSale);
               const isActive = selectedSize === value;
              return (
                <button key={value} onClick={() => handleSizeClick(value)} disabled={!isAvailable} className={clsx('flex items-center justify-center rounded-full border px-4 py-2 text-sm', {'cursor-not-allowed bg-gray-100 text-gray-400': !isAvailable, 'border-black bg-black text-white': isActive, 'border-gray-300 text-black hover:border-black': !isActive && isAvailable })}>{value}</button>
              )
            })}
          </div>
      </SlideUpPanel>
      <QuickView 
        product={quickViewProduct} 
        onClose={() => setQuickViewProduct(null)}
        onOpenSizeSelector={() => {
            setQuickViewProduct(null); // Close the quick view panel first
            setIsSizeSelectorOpen(true); // Then open the main size selector
        }}
      />
    </ProductProvider>
  );
}