import Grid from 'components/grid';
import { GridTileImage } from 'components/grid/tile';
import { ProductViewTracker } from '@/components/tracking/BehaviorTracking';
import { Product } from '@prisma/client';
import Link from 'next/link';
import { useSettings } from '@/hooks/useSettings';

export default function ProductGridItems({ products }: { products: Product[] }) {
  const { currency } = useSettings();
  
  return (
    <>
      {products.map((product) => {
        // Use first image from images array if available, otherwise fall back to imageUrl
        const imageUrl = (product as any).images && (product as any).images.length > 0 
          ? (product as any).images[0].imageUrl 
          : product.imageUrl;
        
        // Transform product for tracking
        const trackingProduct = {
          id: product.id,
          title: product.name,
          price: parseFloat(product.price.toString()),
          category: product.categoryId ? 'category_' + product.categoryId : 'uncategorized'
        };
        
        return (
          <Grid.Item key={product.slug} className="animate-fadeIn">
            <ProductViewTracker product={trackingProduct} viewType="grid">
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
                    currencyCode: currency
                  }}
                  src={imageUrl || '/placeholder.jpg'}
                  fill
                  sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </Link>
            </ProductViewTracker>
          </Grid.Item>
        );
      })}
    </>
  );
}
