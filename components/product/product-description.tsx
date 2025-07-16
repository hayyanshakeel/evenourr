import Price from 'components/price';
import { Product } from 'lib/shopify/types';
import { ShareButton } from './share-button';
import { VariantSelector } from './variant-selector';
// We no longer need the ChevronDownIcon
// import { ChevronDownIcon } from '@heroicons/react/24/outline';

export function ProductDescription({ product }: { product: Product }) {
  return (
    <div className="flex flex-col">
      
      {/* Container for Title and Share Button */}
      {/* Reduced bottom margin to make it closer to the price */}
      <div className="mb-1 flex items-start justify-between">
        
        {/* Title: Removed the wrapper div and the dropdown arrow */}
        <h1 className="text-lg font-medium uppercase tracking-wide text-black">
          {product.title}
        </h1>
        
        <ShareButton 
          productTitle={product.title} 
          productImage={product.featuredImage.url} 
        />
      </div>

      {/* Price Component with reduced bottom margin to be closer to the variants */}
      <div className="mb-5">
        <Price
          // Matched font size to the title and removed bold for a cleaner look
          className="text-lg text-black"
          amount={product.priceRange.maxVariantPrice.amount}
          currencyCode={product.priceRange.maxVariantPrice.currencyCode}
        />
      </div>
      
      {/* Variant Selector */}
      <VariantSelector options={product.options} variants={product.variants} />

      {/* Product Description */}
      {product.descriptionHtml ? (
        <div
          className="prose max-w-none pt-6 text-sm text-gray-700"
          dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
        />
      ) : null}
    </div>
  );
}