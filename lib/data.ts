import { db } from '@/lib/db';
import { products } from './db/schema';
import { desc } from 'drizzle-orm';

export async function getAllProducts() {
  try {
    const allProducts = await db.query.products.findMany({
      with: {
        variants: true, // This now works correctly
      },
      orderBy: [desc(products.createdAt)],
    });
    return allProducts;
  } catch (error) {
    console.error('Failed to fetch all products:', error);
    return [];
  }
}