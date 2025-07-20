import { notFound } from 'next/navigation';
import { getProduct, getProductRecommendations } from 'lib/shopify';
import { HIDDEN_PRODUCT_TAG } from 'lib/constants';

// --- FIX: Corrected import statement ---
// ProductPageClient is a default export, so it should be imported without curly braces.
import ProductPageClient from './client';

export const runtime = 'edge';

export async function generateMetadata({ params }: { params: { handle: string } }) {
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable
      }
    },
    openGraph: url
      ? {
          images: [
            {
              url,
              width,
              height,
              alt
            }
          ]
        }
      : null
  };
}

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const relatedProducts = await getProductRecommendations(product.id);

  return <ProductPageClient product={product} relatedProducts={relatedProducts} />;
}