import { Product } from '@prisma/client';
import Link from 'next/link';
import Image from 'next/image';
import Price from 'components/price';
import { useSettings } from '@/hooks/useSettings';

export function RelatedProducts({ products }: { products: Product[] }) {
  const { currency } = useSettings();
  
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {products.map((product) => {
        // Use first image from images array if available, otherwise fall back to imageUrl
        const imageUrl = (product as any).images && (product as any).images.length > 0 
          ? (product as any).images[0].imageUrl 
          : product.imageUrl;
          
        return (
          <li key={product.slug} className="rounded-lg border bg-white p-4">
            <Link href={`/product/${product.slug}`}>
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt={product.name}
                  width={200}
                  height={200}
                />
              )}
              <h3>{product.name}</h3>
              <Price amount={product.price.toString()} currencyCode={currency} />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}