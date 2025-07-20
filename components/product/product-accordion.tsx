'use client';

import { useState } from 'react';
import { Product } from 'lib/shopify/types';

export function ProductAccordion({ product }: { product: Product }) {
  const [open, setOpen] = useState<number | null>(null);

  const toggle = (index: number) => {
    if (open === index) {
      return setOpen(null);
    }
    setOpen(index);
  };

  const accordionData = [
    { title: 'Materials', content: 'Made with the finest materials.' },
    { title: 'Shipping & Returns', content: 'Free shipping and returns.' },
    { title: 'Care Instructions', content: 'Machine wash cold.' }
  ];

  return (
    <div>
      {accordionData.map((data, index) => (
        <div key={index} className="border-b">
          <button
            onClick={() => toggle(index)}
            className="flex w-full items-center justify-between py-4 text-left"
          >
            <span>{data.title}</span>
            <span>{open === index ? '-' : '+'}</span>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              open === index ? 'max-h-96' : 'max-h-0'
            }`}
          >
            <div className="p-4">{data.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
