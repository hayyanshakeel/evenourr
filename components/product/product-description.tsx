import Price from 'components/price';
import { Product } from 'lib/shopify/types';
import { ShareButton } from './share-button';
import { VariantSelector } from './variant-selector';

export function ProductDescription({ product }: { product: Product }) {
  return (
    <div className="flex flex-col">
      
      {/* Container for Title and Share Button */}
      {/* Changed items-start to items-center for perfect vertical alignment */}
      <div className="mb-1 flex items-center justify-between">
        
        <h1 className="text-lg font-medium uppercase leading-tight tracking-wide text-black">
          {product.title}
        </h1>
        
        {/* The padding is handled inside the ShareButton component, 
            but this container alignment will fix its position.
        */}
        <ShareButton 
          productTitle={product.title} 
          productImage={product.featuredImage.url} 
        />
      </div>

      {/* Price Component */}
      <div className="mb-4">
        <Price
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