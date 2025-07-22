// app/api/coupons/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { coupons } from '@/lib/db/schema';
import { z } from 'zod';
import { eq } from 'drizzle-orm';

const CreateCouponSchema = z.object({
  code: z.string().min(1),
  type: z.enum(['fixed', 'percent']),
  value: z.number().int().positive(),
  description: z.string().optional(),
  minCart: z.number().int().min(0).optional(),
  maxUses: z.number().int().min(1).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, type, value, description, minCart, maxUses } = CreateCouponSchema.parse(body);

    const existingCoupon = await db
      .select()
      .from(coupons)
      .where(eq(coupons.code, code.toUpperCase()))
      .limit(1);

    if (existingCoupon.length > 0) {
      return NextResponse.json({ error: 'Coupon with this code already exists' }, { status: 400 });
    }

    const [newCoupon] = await db.insert(coupons).values({
      code: code.toUpperCase(),
      type,
      value,
      description,
      minCart: minCart ?? 0,
      maxUses: maxUses ?? 1,
      uses: 0,
    }).returning();

    return NextResponse.json(newCoupon, { status: 201 });
  } catch (err) {
    console.error('Create coupon error:', err);
    return NextResponse.json({ error: 'Could not create coupon' }, { status: 500 });
  }
}