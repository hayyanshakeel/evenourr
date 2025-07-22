// app/api/cart/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { carts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  const cartIdCookie = req.cookies.get('cartId');
  if (!cartIdCookie?.value) return NextResponse.json({ cart: null });

  const [cart] = await db
    .select()
    .from(carts)
    .where(eq(carts.id, cartIdCookie.value))
    .limit(1);

  return NextResponse.json({ cart });
}