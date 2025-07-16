import Price from 'components/price';
import { Product } from 'lib/shopify/types';
import { VariantSelector } from './variant-selector';
import { ShareButton } from './share-button';
import { ChevronDown } from 'lucide-react';

export function ProductDescription({ product }: { product: Product }) {
  const compareAtPrice = product.compareAtPriceRange?.maxVariantPrice;

  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-x-2">
          <h1 className="text-xl font-medium leading-tight text-gray-900">{product.title}</h1>
          <ChevronDown size={18} className="text-gray-500" />
        </div>
        
        {/* Pass the product title and image URL to the ShareButton */}
        <ShareButton 
          productTitle={product.title} 
          productImage={product.featuredImage.url} 
        />
      </div>

      <Price
        amount={product.priceRange.maxVariantPrice.amount}
        compareAtAmount={compareAtPrice?.amount}
        currencyCode={product.priceRange.maxVariantPrice.currencyCode}
      />

      <VariantSelector options={product.options} variants={product.variants} />

      {product.descriptionHtml ? (
        <div
          className="prose max-w-none text-sm text-gray-700"
          dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
        />
      ) : null}
    </div>
  );
}