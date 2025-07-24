import { Product } from '@prisma/client';
import Link from 'next/link';
import Image from 'next/image';
import Price from 'components/price';

export function RelatedProducts({ products }: { products: Product[] }) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {products.map((product) => (
        <li key={product.slug} className="rounded-lg border bg-white p-4">
          <Link href={`/product/${product.slug}`}>
            {product.imageUrl && (
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={200}
                height={200}
              />
            )}
            <h3>{product.name}</h3>
            <Price amount={product.price.toString()} currencyCode="USD" />
          </Link>
        </li>
      ))}
    </ul>
  );
}