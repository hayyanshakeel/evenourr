// components/product/product-accordion.tsx

'use client';

import { Disclosure, Transition } from '@headlessui/react';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Fragment, useEffect, useState } from 'react';

type AccordionItem = {
  title: string;
  content: string;
  isHtml?: boolean; // Flag to indicate if content is HTML
};

function parseDescription(html: string): AccordionItem[] {
  const sections: AccordionItem[] = [];

  // FIX: Add the new "Shipping to India" section first
  sections.push({
    title: 'SHIPPING TO INDIA',
    content: `
      <div class="space-y-4">
        <div>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>Delivery</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </div>
          <div class="mt-2 ml-7 p-3 bg-gray-50 rounded-md text-sm">
            <p>Express shipping available</p>
            <p>Shipping Time: 8 - 12 days</p>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h5V4H4zm0 9h5v5H4v-5zm9-9h5v5h-5V4zm0 9h5v5h-5v-5z" /></svg>
            <span>Return Policy</span>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </div>
      </div>
    `,
    isHtml: true
  });

  const parts = html.split(/<h2[^>]*>/i);

  if (parts.length > 1) {
    for (let i = 1; i < parts.length; i++) {
      const sectionContent = parts[i];
      if (sectionContent) {
        const titleMatch = sectionContent.match(/([^<]+)<\/h2>/i);
        if (titleMatch && titleMatch[1]) {
          const title = titleMatch[1].trim();
          const content = sectionContent.substring(sectionContent.indexOf('</h2>') + 5).trim();
          if (content) {
            sections.push({ title, content });
          }
        }
      }
    }
  }

  if (sections.length === 1 && html.trim()) { // Only add if it's just the shipping info
    sections.push({ title: 'Product Details', content: html });
  }

  sections.push({ title: 'Size & Fit', content: 'This item fits true to size.' });
  sections.push({ title: 'Free Shipping, Free Returns', content: 'Enjoy free shipping and returns on all orders.' });

  return sections;
}

export function ProductAccordion({ descriptionHtml }: { descriptionHtml: string }) {
  const [items, setItems] = useState<AccordionItem[]>([]);

  useEffect(() => {
    setItems(parseDescription(descriptionHtml));
  }, [descriptionHtml]);

  if (!items.length) {
    return null;
  }

  return (
    <div className="w-full space-y-3">
      {items.map((item, i) => (
        <Disclosure as="div" key={i} className="border border-neutral-300">
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between p-4 text-left text-sm font-medium">
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
                <Disclosure.Panel className="prose max-w-none px-4 pb-4 pt-0 text-sm text-gray-600">
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
