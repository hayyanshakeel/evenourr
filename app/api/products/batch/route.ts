import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'Product IDs must be a non-empty array' }, { status: 400 });
    }

    const productDetails = await prisma.product.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        imageUrl: true,
      },
    });

    return NextResponse.json(productDetails);
  } catch (error) {
    console.error('Failed to fetch product details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}