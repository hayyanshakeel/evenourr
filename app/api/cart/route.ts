// app/api/cart/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { carts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const MOCK_USER_ID = 1;

export async function GET() {
  try {
    const userCart = await db.query.carts.findFirst({
      where: eq(carts.userId, MOCK_USER_ID),
    });

    if (!userCart) {
      return NextResponse.json({ items: [] });
    }

    return NextResponse.json(userCart);
  } catch (error) {
    console.error('Failed to fetch cart:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}