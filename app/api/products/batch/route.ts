import { NextResponse } from 'next/server';
import { db } from '@/lib/turso';
import { products } from '@/lib/schema';
import { inArray } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'Product IDs must be a non-empty array' }, { status: 400 });
    }

    // Fetch specific fields for the products in the cart
    const productDetails = await db
      .select({
        id: products.id,
        title: products.title,
        handle: products.handle,
        imageUrl: products.imageUrl
      })
      .from(products)
      .where(inArray(products.id, ids))
      .all();

    return NextResponse.json(productDetails);
  } catch (error) {
    console.error('Failed to fetch product details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
