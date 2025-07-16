import Price from 'components/price';
import { Product } from 'lib/shopify/types';
import { ShareButton } from './share-button';
import { VariantSelector } from './variant-selector';

export function ProductDescription({ product }: { product: Product }) {
  return (
    // Increased gap between elements for better spacing
    <div className="flex flex-col gap-y-6">
      
      {/* Container for Title and Share Button */}
      <div className="flex items-center justify-between">
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
      <VariantSelector options={product.options} variants={product.variants} />

      {/* Original Product Description */}
      {product.descriptionHtml ? (
        <div
          className="prose max-w-none text-sm text-gray-700"
          dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
        />
      ) : null}
    </div>
  );
}