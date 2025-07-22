import { NextResponse } from 'next/server';
import { db } from '@/lib/turso';
import { products } from '@/lib/schema';

/**
 * Handles GET requests to fetch all products.
 * This will be used by your storefront to display products.
 */
export async function GET() {
  try {
    const allProducts = await db.select().from(products);

    return NextResponse.json(allProducts);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

/**
 * Handles POST requests to create a new product.
 * This will be used by your admin dashboard.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, price, imageUrl, inventory, handle } = body;

    // Basic validation
    if (!title || !price || !handle) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newProduct = await db
      .insert(products)
      .values({
        title,
        description,
        price,
        imageUrl,
        inventory,
        handle
      })
      .returning();

    return NextResponse.json(newProduct[0], { status: 201 });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
