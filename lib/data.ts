// lib/data.ts
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import 'server-only';

export async function getProductByHandle(handle: string) {
  try {
    // Correctly query by slug
    const productData = await db.query.products.findFirst({
      where: eq(products.slug, handle),
      with: {
        // These relations must be defined in your drizzle schema to work
        variants: true,
        // Assuming 'images' is a valid relation name on your products table
        // If not, you will need to query for images separately
      }
    });
    return productData;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch product.');
  }
}

export async function getRelatedProducts(productId: number) {
  try {
    const related = await db.query.products.findMany({
      limit: 5,
      where: (products, { ne }) => ne(products.id, productId)
    });
    return related;
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}