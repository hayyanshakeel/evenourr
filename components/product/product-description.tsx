import Price from 'components/price';
import { Product } from 'lib/shopify/types';
import { VariantSelector } from './variant-selector';

export function ProductDescription({ product }: { product: Product }) {
  return (
    <div className="flex flex-col gap-y-4">
      {/* Product Title */}
      <h1 className="text-2xl font-bold leading-tight text-gray-900">{product.title}</h1>

      {/* Price */}
      <Price
        className="text-2xl font-semibold text-gray-800"
        amount={product.priceRange.maxVariantPrice.amount}
        currencyCode={product.priceRange.maxVariantPrice.currencyCode}
      />

      <hr className="border-gray-200" />

      {/* Variant Selectors */}
      <VariantSelector options={product.options} variants={product.variants} />

      {/* Description */}
      {product.descriptionHtml ? (
        <div
          className="prose max-w-none text-base text-gray-700"
          dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
        />
      ) : null}
    </div>
  );
}