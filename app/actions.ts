'use server';

import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function getProductById(productId: number) {
  try {
    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
      with: {
        variants: true, // This now works correctly
      },
    });
    return product;
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return null;
  }
}