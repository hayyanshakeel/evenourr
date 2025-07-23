import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const allProducts = await db.query.products.findMany({
      orderBy: (products, { desc }) => [desc(products.createdAt)],
    });
    return NextResponse.json(allProducts);
  } catch (error) {
    console.error('API Error /api/products:', error);
    return NextResponse.json({ message: 'Failed to fetch products' }, { status: 500 });
  }
}