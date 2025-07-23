import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { coupons } from '@/lib/db/schema';
import { z } from 'zod';
import { desc } from 'drizzle-orm';

const couponSchema = z.object({
  code: z.string().min(1),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.number().min(0),
  expiresAt: z.string().optional().nullable(),
});

export async function GET() {
  try {
    const allCoupons = await db.query.coupons.findMany({
      orderBy: [desc(coupons.createdAt)]
    });
    return NextResponse.json(allCoupons);
  } catch (error) {
    console.error('Failed to fetch coupons:', error);
    return NextResponse.json({ message: 'Failed to fetch coupons' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = couponSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(validation.error.errors, { status: 400 });
    }
    const { code, discountType, discountValue, expiresAt } = validation.data;
    const [newCoupon] = await db
      .insert(coupons)
      .values({
        code,
        discountType,
        discountValue,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      })
      .returning();
    return NextResponse.json(newCoupon, { status: 201 });
  } catch (error) {
    console.error('Failed to create coupon:', error);
    return NextResponse.json({ message: 'Failed to create coupon' }, { status: 500 });
  }
}