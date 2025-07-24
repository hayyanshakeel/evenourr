import { prisma } from '@/lib/db';
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

  const product = await prisma.products.findFirst({ where: { slug: handle } });
  
  if (!product) return notFound();

  return {
    title: product.name,
    description: product.description || '',
  };
}

// --- Corrected Page Component ---
export default async function ProductPage({ params }: { params: { handle: string } }) {
  const { handle } = params;
  if (!handle) return notFound();

  const product = await prisma.products.findFirst({ where: { slug: handle } });

  if (!product) {
    return notFound();
  }

  // Create mock variants based on the product itself since the variants table
  // has different structure than expected by ProductDetails component
  const mockVariants = [{
    id: product.id,
    productId: product.id,
    name: product.name,
    price: product.price,
    inventory: product.inventory,
    createdAt: product.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: product.updatedAt?.toISOString() || new Date().toISOString(),
  }];

  // Transform the database product to match the expected Product interface
  const transformedProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug || handle, // Fallback to handle if slug is null
    description: product.description || '',
    price: product.price,
    imageUrl: product.imageUrl || null,
    status: product.status,
    inventory: product.inventory,
    createdAt: product.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: product.updatedAt?.toISOString() || new Date().toISOString(),
    variants: mockVariants
  };

  return <ProductDetails product={transformedProduct} />;
}
