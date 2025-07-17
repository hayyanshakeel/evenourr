// app/product/[handle]/page.tsx

'use client'; // This is essential for using hooks like useState and useEffect

import { AddToCart } from '@/components/cart/add-to-cart';
import Footer from '@/components/layout/footer';
import ProductGridItems from '@/components/layout/product-grid-items';
import { Gallery } from '@/components/product/gallery';
import { ProductDescription } from '@/components/product/product-description';
import { ProductProvider } from '@/components/product/product-context';
import { VariantSelector } from '@/components/product/variant-selector';
import { getProduct, getProductRecommendations } from '@/lib/shopify';
import { Image, Product } from '@/lib/shopify/types';
import { Disclosure, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { notFound } from 'next/navigation';
import { Fragment, Suspense, useEffect, useState } from 'react';

// ========================================================================
// ACCORDION COMPONENT
// ========================================================================
type AccordionItem = {
  title: string;
  content: string;
};

// This utility function safely parses your HTML string into sections
function parseDescription(html: string): AccordionItem[] {
  const sections: AccordionItem[] = [];
  const parts = html.split(/<h2[^>]*>/i);

  if (parts.length > 1) {
    for (let i = 1; i < parts.length; i++) {
      const sectionContent = parts[i];
      if (sectionContent) {
        const titleMatch = sectionContent.match(/([^<]+)<\/h2>/i);
        const title = titleMatch ? titleMatch[1].trim() : `Section ${i}`;
        const content = sectionContent.substring(sectionContent.indexOf('</h2>') + 5).trim();
        if (content) {
          sections.push({ title, content });
        }
      }
    }
  }

  if (sections.length === 0 && html.trim()) {
    sections.push({ title: 'Product Details', content: html });
  }

  // Add static sections
  sections.push({ title: 'Size & Fit', content: 'This item fits true to size.' });
  sections.push({ title: 'Free Shipping, Free Returns', content: 'Enjoy free shipping and returns on all orders.' });
  
  return sections;
}

function ProductAccordion({ descriptionHtml }: { descriptionHtml: string }) {
  const [items, setItems] = useState<AccordionItem[]>([]);

  useEffect(() => {
    setItems(parseDescription(descriptionHtml));
  }, [descriptionHtml]);

  if (!items.length) return null;

  return (
    <div className="w-full">
      {items.map((item, i) => (
        <Disclosure as="div" key={i} className="border-b border-gray-300">
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between py-4 text-left text-sm font-medium">
                <span className="font-semibold uppercase">{item.title}</span>
                <ChevronDownIcon
                  className={`${open ? 'rotate-180' : ''} h-5 w-5 text-gray-500 transition-transform`}
                />
              </Disclosure.Button>
              <Transition
                as={Fragment}
                enter="transition duration-150 ease-out"
                enterFrom="opacity-0 -translate-y-2"
                enterTo="opacity-100 translate-y-0"
                leave="transition duration-100 ease-out"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 -translate-y-2"
              >
                <Disclosure.Panel className="prose max-w-none px-2 pb-4 pt-2 text-sm text-gray-600">
                  <div dangerouslySetInnerHTML={{ __html: item.content }} />
                </Disclosure.Panel>
              </Transition>
            </>
          )}
        </Disclosure>
      ))}
    </div>
  );
}
// ========================================================================
// END ACCORDION
// ========================================================================


// ========================================================================
// MAIN PAGE COMPONENT
// ========================================================================
export default function ProductPage({ params }: { params: { handle: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [recommendations, setRecommendations] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const p = await getProduct(params.handle);
      if (p) {
        setProduct(p);
        const recs = await getProductRecommendations(p.id);
        setRecommendations(recs);
      } else {
        notFound();
      }
    };
    fetchData();
  }, [params.handle]);

  if (!product) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
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

        <div className="mx-auto max-w-screen-2xl px-4 pt-8">
          {recommendations.length > 0 && (
            <div className="py-8">
              <h2 className="mb-4 text-2xl font-bold">Related Products</h2>
              <ProductGridItems products={recommendations} />
            </div>
          )}
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
    </ProductProvider>
  );
}