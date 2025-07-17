import Price from 'components/price';
import { Product } from 'lib/shopify/types';
import { ShareButton } from './share-button';

export function ProductDescription({ product }: { product: Product }) {
  return (
    <>
      {/* UPDATED: Reduced bottom margin from mb-2 to mb-1 */}
      <div className="mb-1 flex items-start justify-between">
        <h1 className="text-base font-normal uppercase tracking-wide text-black">
          {product.title}
        </h1>
        <div className="flex items-center">
          <ShareButton 
            productTitle={product.title} 
            productImage={product.featuredImage.url} 
          />
        </div>
      </div>

      <div className="mb-4">
        <Price
          className="text-xl font-bold"
          amount={product.priceRange.maxVariantPrice.amount}
          currencyCode={product.priceRange.maxVariantPrice.currencyCode}
        />
      </div>
    </>
  );
}