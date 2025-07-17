// components/product/product-accordion.tsx

'use client';

import { Disclosure, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Fragment, useEffect, useState } from 'react';

type AccordionItem = {
  title: string;
  content: string;
  isHtml?: boolean;
};

function parseDescription(html: string): AccordionItem[] {
  const sections: AccordionItem[] = [];

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

  if (sections.length === 0 && html.trim()) {
    sections.push({ title: 'Product Details', content: html });
  }

  sections.push({ title: 'Size & Fit', content: 'This item fits true to size.' });
  // --- TYPO FIX START ---
  // Changed "sections.s.push" to "sections.push"
  sections.push({ title: 'Free Shipping, Free Returns', content: 'Enjoy free shipping and returns on all orders.' });
  // --- TYPO FIX END ---

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