import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ProductDetails from '@/components/product-details';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  if (!handle) return notFound();

  const product = await prisma.product.findFirst({ where: { slug: handle } });
  
  if (!product) return notFound();

  return {
    title: product.name,
    description: product.description || '',
  };
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  if (!handle) return notFound();

  const product = await prisma.product.findFirst({ where: { slug: handle } });

  if (!product) {
    return notFound();
  }

  const mockVariants = [{
    id: product.id,
    productId: product.id,
    name: product.name,
    price: product.price,
    inventory: product.inventory,
    createdAt: product.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: product.updatedAt?.toISOString() || new Date().toISOString(),
  }];

  const transformedProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug || handle,
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