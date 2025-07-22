// components/product/related-products.tsx

import { Product } from '@/lib/definitions';
import Link from 'next/link';
import Image from 'next/image';
import Price from 'components/price';

export function RelatedProducts({ products }: { products: Product[] }) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {products.map((product) => (
        <li key={product.slug} className="rounded-lg border bg-white p-4">
          {/* Use product.slug for the link */}
          <Link href={`/product/${product.slug}`} className="h-full w-full">
            <div className="relative aspect-square w-full overflow-hidden">
              <Image
                src={product.images?.[0]?.url || '/placeholder.svg'}
                // Use product.name for the alt text
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            {/* Use product.name for the title */}
            <p className="mt-2 font-semibold">{product.name}</p>
            <Price
              className="text-sm"
              amount={product.price.toString()}
              currencyCode="USD" // Set your currency
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}