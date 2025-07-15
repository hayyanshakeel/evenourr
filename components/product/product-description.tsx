import { AddToCart } from 'components/cart/add-to-cart';
import Price from 'components/price';
import { Product } from 'lib/shopify/types';
import { VariantSelector } from './variant-selector';

export function ProductDescription({ product }: { product: Product }) {
  return (
    <>
      <div className="mb-6 flex flex-col">
        {/* Title, Price, and Size Chart Section */}
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

        {/* Variant Selector */}
        <VariantSelector options={product.options} variants={product.variants} />

        {/* Gift Card Checkbox */}
        <div className="mb-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="h-4 w-4 rounded-sm border-gray-300 bg-transparent" />
            <span className="text-sm">HAVE A GIFT CARD?</span>
          </label>
        </div>

        {/* Action Buttons */}
        <button
          aria-label="Buy Now"
          className="mb-4 w-full rounded-md bg-black p-3 text-center text-sm font-medium text-white border border-white"
        >
          BUY NOW
        </button>
        <AddToCart product={product} />
      </div>
    </>
  );
}