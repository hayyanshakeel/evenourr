// components/product/variant-selector.tsx

'use client';

import { ProductVariant } from '@/lib/definitions';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { createUrl } from 'lib/utils'; // Assuming you have this utility function

// This is a basic variant selector. You can expand it with more complex logic.
// For now, it just shows buttons for each variant.
export function VariantSelector({ variants }: { variants: ProductVariant[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleVariantChange = (variantId: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('variant', variantId.toString());
    const newUrl = createUrl(pathname, newSearchParams);
    router.replace(newUrl, { scroll: false });
  };

  if (!variants || variants.length === 0) {
    return null;
  }

  const currentVariantId = searchParams.get('variant');

  return (
    <div className="mb-4">
      <h3 className="mb-2 text-sm font-medium uppercase tracking-wide">Variants</h3>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => {
          const isActive = currentVariantId === variant.id.toString();
          return (
            <button
              key={variant.id}
              onClick={() => handleVariantChange(variant.id)}
              className={`flex min-w-[48px] items-center justify-center rounded-full border bg-neutral-100 px-3 py-2 text-sm
                ${isActive ? 'ring-2 ring-blue-600' : ''}
              `}
            >
              {variant.title}
            </button>
          );
        })}
      </div>
    </div>
  );
}