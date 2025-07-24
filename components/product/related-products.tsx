// components/product/related-products.tsx

import { Product } from '@/lib/definitions';
import Link from 'next/link';
import Image from 'next/image';
import Price from 'components/price';

export function RelatedProducts({ products }: { products: Product[] }) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {products.map((product) => (
        <li key={product.handle} className="rounded-lg border bg-white p-4">
          <Link href={`/product/${product.handle}`}>
            {product.images[0] && (
              <Image
                src={product.images[0].url}
                alt={product.title}
                width={200}
                height={200}
              />
            )}
            <h3>{product.title}</h3>
            <Price 
              amount={product.priceRange.maxVariantPrice.amount} 
              currencyCode={product.priceRange.maxVariantPrice.currencyCode}
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}