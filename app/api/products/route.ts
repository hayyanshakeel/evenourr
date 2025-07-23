import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function GET() {
  console.log('--- [API] Received GET request for /api/products ---');
  try {
    const allProducts = await db.query.products.findMany({
      orderBy: (products, { desc }) => [desc(products.createdAt)],
    });

    console.log(`--- [API] Found ${allProducts.length} products in the database. ---`);
    // Uncomment the line below to see the actual data in your terminal
    // console.log(allProducts);

    return NextResponse.json(allProducts);
  } catch (error) {
    console.error('--- [API] CRITICAL ERROR fetching products: ---', error);
    return NextResponse.json({ message: 'Failed to fetch products' }, { status: 500 });
  }
}

// Keep your POST function as it is, with the revalidatePath call.
export async function POST(req: Request) {
    // ... your existing POST logic ...
    revalidatePath('/dashboard/products');
    // ...
}