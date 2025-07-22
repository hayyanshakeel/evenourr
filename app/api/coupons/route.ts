// app/api/coupons/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { coupons } from '@/lib/db/schema';
import { z } from 'zod';
import { desc, or, like } from 'drizzle-orm';

// This is the validation schema for creating a new coupon.
const CreateCouponSchema = z.object({
  code: z.string().min(1),
  description: z.string().optional(),
  discountType: z.enum(['fixed', 'percentage']),
  discountValue: z.number(),
  usageLimit: z.number().int().optional(),
});

/**
 * GET /api/coupons - Fetch all coupons
 * This is the function that was missing. It fetches the list of all coupons.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    const whereCondition = search
      ? or(
          like(coupons.code, `%${search}%`),
          like(coupons.description, `%${search}%`)
        )
      : undefined;

    const allCoupons = await db
      .select()
      .from(coupons)
      .where(whereCondition)
      .orderBy(desc(coupons.id));

    return NextResponse.json(allCoupons);
  } catch (error) {
    console.error('[COUPONS_GET_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

/**
 * POST /api/coupons - Create a new coupon
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedData = CreateCouponSchema.parse(body);

    const [newCoupon] = await db
      .insert(coupons)
      .values({
        ...parsedData,
        code: parsedData.code.toUpperCase(),
        usageCount: 0,
        // Let the database handle the default for createdAt
      })
      .returning();

    return NextResponse.json(newCoupon, { status: 201 });
  } catch (err) {
    console.error('[COUPON_POST_ERROR]', err);
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Could not create coupon' }, { status: 500 });
  }
}