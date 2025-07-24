import Grid from 'components/grid';
import { GridTileImage } from 'components/grid/tile';
import { Product } from '@prisma/client';
import Link from 'next/link';

export default function ProductGridItems({ products }: { products: Product[] }) {
  return (
    <>
      {products.map((product) => (
        <Grid.Item key={product.slug} className="animate-fadeIn">
          <Link
            className="relative inline-block h-full w-full"
            href={`/product/${product.slug}`}
            prefetch={true}
          >
            <GridTileImage
              alt={product.name}
              label={{
                title: product.name,
                amount: product.price.toString(),
                currencyCode: 'USD'
              }}
              src={product.imageUrl || '/placeholder.jpg'}
              fill
              sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          </Link>
        </Grid.Item>
      ))}
    </>
  );
}
