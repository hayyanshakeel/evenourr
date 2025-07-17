import Price from 'components/price';
import { Product } from 'lib/shopify/types';
import { ShareButton } from './share-button';

export function ProductDescription({ product }: { product: Product }) {
  return (
    <>
      {/* Container for Title and Share Button */}
      <div className="mb-2 flex items-start justify-between">
        <h1 className="text-2xl font-medium uppercase tracking-tight text-black">
          {product.title}
        </h1>
        <div className="flex items-center">
          <ShareButton 
            productTitle={product.title} 
            productImage={product.featuredImage.url} 
          />
        </div>
      </div>

      {/* Price Component */}
      <div className="mb-6">
        <Price
          className="text-lg text-black"
          amount={product.priceRange.maxVariantPrice.amount}
          currencyCode={product.priceRange.maxVariantPrice.currencyCode}
        />
      </div>
      
      {/* Product Description Text */}
      {product.descriptionHtml ? (
        <div
          className="prose max-w-none text-sm text-gray-700"
          dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
        />
      ) : null}
    </>
  );
}