import { AddToCart } from 'components/cart/add-to-cart';
import Price from 'components/price';
import { Product } from 'lib/shopify/types';
import { VariantSelector } from './variant-selector';

// A helper component for creating the two-column rows
const DescriptionRow = ({ title, content }: { title: string; content: string }) => (
  <div className="flex w-full gap-x-4 border-b border-neutral-700 py-6">
    <h3 className="w-1/4 flex-none font-medium uppercase">{title}</h3>
    <div
      className="w-3/4 flex-grow text-sm text-white/[60%]"
      dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }}
    />
  </div>
);

export function ProductDescription({ product }: { product: Product }) {
  return (
    <>
      <div className="mb-6 flex flex-col">
        {/* Top Section with title, price, variants, and buttons */}
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
              className="rounded-md border border-white px-3 py-1 text-sm font-medium text-white hover:bg-white hover:text-black"
            >
              SIZE CHART
            </button>
          </div>
        </div>
        <VariantSelector options={product.options} variants={product.variants} />
        <div className="mb-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="h-4 w-4 rounded-sm border-gray-300 bg-transparent" />
            <span className="text-sm">HAVE A GIFT CARD?</span>
          </label>
        </div>
        <button
          aria-label="Buy Now"
          className="mb-4 w-full rounded-md bg-black p-3 text-center text-sm font-medium text-white border border-white"
        >
          BUY NOW
        </button>
        <AddToCart product={product} />

        {/* New Structured Description Section */}
        <div className="mt-8 border-t border-neutral-700">
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