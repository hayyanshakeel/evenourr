import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ProductDetails from '@/components/product-details';

// --- Corrected Metadata Function ---
export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const { handle } = await params;
  if (!handle) return notFound();

  const product = await db.query.products.findFirst({ where: eq(products.slug, handle) });
  
  if (!product) return notFound();

  return {
    title: product.name,
    description: product.description || '',
  };
}

// --- Corrected Page Component ---
export default async function ProductPage({ params }: { params: { handle:string } }) {
  const { handle } = await params;
  if (!handle) return notFound();

  const productData = await db.query.products.findFirst({
    where: eq(products.slug, handle),
  });

  if (!productData) {
    return notFound();
  }

  // Create mock variants based on the product itself since the variants table
  // has different structure than expected by ProductDetails component
  const mockVariants = [{
    id: productData.id,
    productId: productData.id,
    name: productData.name,
    price: productData.price,
    inventory: productData.inventory,
    createdAt: productData.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: productData.updatedAt?.toISOString() || new Date().toISOString(),
  }];

  // Transform the database product to match the expected Product interface
  const transformedProduct = {
    id: productData.id,
    name: productData.name,
    slug: productData.slug || handle, // Fallback to handle if slug is null
    description: productData.description || '',
    price: productData.price,
    imageUrl: productData.imageUrl || null,
    status: productData.status,
    inventory: productData.inventory,
    createdAt: productData.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: productData.updatedAt?.toISOString() || new Date().toISOString(),
    variants: mockVariants
  };

  return <ProductDetails product={transformedProduct} />;
}
