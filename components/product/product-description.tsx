import Price from 'components/price';
import { Product } from 'lib/shopify/types';
import { ShareButton } from './share-button';
import { VariantSelector } from './variant-selector';

export function ProductDescription({ product }: { product: Product }) {
  return (
    // Reduced the gap from gap-y-6 to gap-y-4 for a tighter layout
    <div className="flex flex-col gap-y-4">
      
      {/* Container for Title and Share Button */}
      <div className="flex items-start justify-between">
        <h1 className="text-2xl font-black uppercase">{product.title}</h1>
        <ShareButton 
          productTitle={product.title} 
          productImage={product.featuredImage.url} 
        />
      </div>

      {/* Price Component */}
      <Price
        amount={product.priceRange.maxVariantPrice.amount}
        currencyCode={product.priceRange.maxVariantPrice.currencyCode}
      />
      
      {/* Variant Selector for Colors and Sizes */}
      <div className="mt-2">
        <VariantSelector options={product.options} variants={product.variants} />
      </div>

      {/* Original Product Description */}
      {product.descriptionHtml ? (
        <div
          className="prose max-w-none pt-4 text-sm text-gray-700"
          dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
        />
      ) : null}
    </div>
  );
}