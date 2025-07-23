// File: app/api/products/route.ts

import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache'; // 1. Make sure this import is here

// (Your ProductStatus type and GET function remain the same)
type ProductStatus = 'active' | 'draft' | 'archived';

export async function GET() {
  try {
    const allProducts = await db.select().from(products);
    return NextResponse.json(allProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { message: 'Failed to fetch products. Please try again later.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const newProductData = {
      name: body.title?.trim(),
      slug: body.handle?.trim(),
      description: body.description?.trim() || null,
      price: parseInt(body.price, 10),
      status: (body.status as ProductStatus) || 'active',
      imageUrl: body.imageUrl || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      imagePublicId: null,
    };

    if (!newProductData.name || !newProductData.slug || isNaN(newProductData.price)) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    await db.insert(products).values(newProductData);

    // 2. These lines force the cache to clear for your storefront
    revalidatePath('/');          // Clears the cache for the homepage
    revalidatePath('/products');  // Clears the cache for a /products page
    revalidatePath('/product');   // A fallback for paths like /product/[slug]

    return NextResponse.json({ message: 'Product created successfully!' }, { status: 201 });

  } catch (error) {
    console.error('DATABASE INSERT FAILED:', error);
    return NextResponse.json(
      { message: 'Database operation failed.', error: String(error) },
      { status: 500 }
    );
  }
}