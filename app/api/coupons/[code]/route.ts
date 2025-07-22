import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { coupons } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// This explicitly tells Next.js to treat the route as dynamic
export const dynamic = 'force-dynamic';

// GET function to fetch a single coupon
export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const couponCode = params.code.toUpperCase();
    const coupon = await db.query.coupons.findFirst({
      where: eq(coupons.code, couponCode),
    });

    if (!coupon) {
      return new NextResponse(JSON.stringify({ error: 'Coupon not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new NextResponse(JSON.stringify(coupon), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[COUPON_GET_ERROR]', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// PATCH function to update a coupon
export async function PATCH(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const body = await request.json();
    const couponCode = params.code.toUpperCase();
    const updated = await db
      .update(coupons)
      .set(body)
      .where(eq(coupons.code, couponCode))
      .returning();

    if (updated.length === 0) {
      return new NextResponse(JSON.stringify({ error: 'Coupon not found' }), { status: 404 });
    }

    return new NextResponse(JSON.stringify(updated[0]), { status: 200 });
  } catch (error) {
    console.error('[COUPON_PATCH_ERROR]', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

// DELETE function to remove a coupon
export async function DELETE(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const couponCode = params.code.toUpperCase();
    const deleted = await db
      .delete(coupons)
      .where(eq(coupons.code, couponCode))
      .returning({ id: coupons.id });

    if (deleted.length === 0) {
      return new NextResponse(JSON.stringify({ error: 'Coupon not found' }), { status: 404 });
    }

    return new NextResponse(JSON.stringify({ message: 'Coupon deleted' }), { status: 200 });
  } catch (error) {
    console.error('[COUPON_DELETE_ERROR]', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}