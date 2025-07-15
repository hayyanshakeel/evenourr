'use client';

import { AddToCart } from 'components/cart/add-to-cart';
import Price from 'components/price';
import { Product, ProductOption, ProductVariant } from 'lib/shopify/types';
import clsx from 'clsx';
import { useProduct, useUpdateURL } from './product-context';


// --- Code from 'variant-selector.tsx' is now directly inside this file ---

type Combination = {
  id: string;
  availableForSale: boolean;
  [key: string]: string | boolean;
};

function VariantSelector({
  options,
  variants
}: {
  options: ProductOption[];
  variants: ProductVariant[];
}) {
  const { state, updateOption } = useProduct();
  const updateURL = useUpdateURL();
  const hasNoOptionsOrJustOneOption =
    !options.length || (options.length === 1 && options[0]?.values.length === 1);

  if (hasNoOptionsOrJustOneOption) {
    return null;
  }

  const combinations: Combination[] = variants.map((variant) => ({
    id: variant.id,
    availableForSale: variant.availableForSale,
    ...variant.selectedOptions.reduce(
      (accumulator, option) => ({ ...accumulator, [option.name.toLowerCase()]: option.value }),
      {}
    )
  }));

  return options.map((option) => (
    <form key={option.id}>
      <dl className="mb-8">
        <dt className="mb-4 text-sm uppercase tracking-wide">{option.name}</dt>
        <dd className="flex flex-wrap gap-3">
          {option.values.map((value) => {
            const optionNameLowerCase = option.name.toLowerCase();
            const optionParams = { ...state, [optionNameLowerCase]: value };
            const filtered = Object.entries(optionParams).filter(([key, value]) =>
              options.find(
                (option) => option.name.toLowerCase() === key && option.values.includes(value)
              )
            );
            const isAvailableForSale = combinations.find((combination) =>
              filtered.every(
                ([key, value]) => combination[key] === value && combination.availableForSale
              )
            );
            const isActive = state[optionNameLowerCase] === value;

            return (
              <button
                formAction={() => {
                  const newState = updateOption(optionNameLowerCase, value);
                  updateURL(newState);
                }}
                key={value}
                aria-disabled={!isAvailableForSale}
                disabled={!isAvailableForSale}
                title={`${option.name} ${value}${!isAvailableForSale ? ' (Out of Stock)' : ''}`}
                className={clsx(
                  'flex min-w-[48px] items-center justify-center rounded-md border-2 bg-transparent px-3 py-2 text-sm',
                  {
                    'border-black text-black': isActive,
                    'border-neutral-300 text-neutral-500 transition duration-300 ease-in-out hover:border-black hover:text-black':
                      !isActive && isAvailableForSale,
                    'relative z-10 cursor-not-allowed overflow-hidden border-neutral-200 text-neutral-400 ring-neutral-700 before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-neutral-300 before:transition-transform':
                      !isAvailableForSale
                  }
                )}
              >
                {value}
              </button>
            );
          })}
        </dd>
      </dl>
    </form>
  ));
}

// --- Main ProductDescription Component ---

const DescriptionRow = ({ title, content }: { title: string; content: string }) => (
    <div className="flex w-full gap-x-4 border-b border-neutral-200 py-6">
      <h3 className="w-1/4 flex-none font-medium uppercase">{title}</h3>
      <div
        className="w-3/4 flex-grow text-sm text-neutral-500"
        dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }}
      />
    </div>
  );
  
export function ProductDescription({ product }: { product: Product }) {
    return (
      <>
        <div className="mb-6 flex flex-col">
          <div className="mb-4">
            <h1 className="mb-2 text-3xl font-medium">{product.title}</h1>
            <div className="flex items-center justify-between">
              <div className="mr-auto w-auto text-lg">
                <Price
                  amount={product.priceRange.maxVariantPrice.amount}
                  currencyCode={product.priceRange.maxVariantPrice.currencyCode}
                />
              </div>
              <button
                aria-label="Size Chart"
                className="rounded-md border border-black px-3 py-1 text-sm font-medium text-black hover:bg-black hover:text-white"
              >
                SIZE CHART
              </button>
            </div>
          </div>

          <VariantSelector options={product.options} variants={product.variants} />
  
          <div className="mt-6">
              <button
              aria-label="Buy Now"
              className="mb-4 w-full rounded-md bg-white p-3 text-center text-sm font-medium text-black border border-black"
              >
              BUY NOW
              </button>
              <AddToCart product={product} />
          </div>
  
          <div className="mt-8 border-t border-neutral-200">
            {product.descriptionHtml && (
              <DescriptionRow title="Description" content={product.descriptionHtml} />
            )}
            {product.details?.value && (
              <DescriptionRow title="Details" content={product.details.value} />
            )}
            {product.shipping?.value && (
              <DescriptionRow title="Shipping" content={product.shipping.value} />
            )}
          </div>
        </div>
      </>
    );
  }