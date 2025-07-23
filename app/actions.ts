'use server';

import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function getProductByHandle(handle: string) {
  try {
    const product = await db.query.products.findFirst({
      where: eq(schema.products.slug, handle),
      with: {
        variants: true,
        options: true,
      },
    });
    return product;
  } catch (error) {
    console.error('Error fetching product by handle:', error);
    return null;
  }
}